import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Side } from "../../../utils/types/game.types";
import type { Square, PieceType, PieceCode, PromotionPiece } from '../utils/types/chess.types';
import { getPieceSide, getPieceById } from "../utils/lib/getPiece";
import { getAvailableMoves } from "../utils/lib/getAvaibleMoves";
import { playSound } from "../utils/lib/playSound";

import { canPlayCurrentPosition, submitGameMove } from '../../../utils/submitGameMove';
import { useGameStore } from '@/store/gameStore';
import { isKingInCheck } from '../utils/lib/isKingInCheck';
import { canMovePiece } from '../utils/lib/canMovePiece';
import { isMoveSafe } from '../utils/lib/isMoveSafe';
import { canAnalyzePosition, getNavigationPly, getPositionAtPly } from '../../../utils/moveNavigation';
import { analysisPromotion, applyAnalysisMove } from '../../../utils/analysisVariation';

// useChessBoard, обязан просто управлять кликами и дергать за функции как ниточки в зависимости от того, на что мы кликнули

type PendingPromotion = {
    pieceID: string;
    targetSquare: Square;
    side: Side;
};

export default function useChessBoard(
    currentUserSide: Side | null,
    currentTurn: Side,
    pieces: PieceType[],
    lastMove: { piece: PieceCode; from: Square; to: Square; } | null,
    interactionKey: string,
    analysisMode: boolean,
) {
    const [selectedPieceID, setSelectedPieceID] = useState<string | null>(null);
    const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);
    const [markedSquares, setMarkedSquares] = useState<Square[]>([]);
    const gameId = useGameStore(s => s.gameId);
    const gameStatus = useGameStore(s => s.gameStatus);
    const viewRevision = useGameStore(s => s.viewRevision);
    const [previousInteractionKey, setPreviousInteractionKey] = useState(interactionKey);
    if (previousInteractionKey !== interactionKey) {
        setPreviousInteractionKey(interactionKey);
        setSelectedPieceID(null);
        setPendingPromotion(null);
        setMarkedSquares([]);
    }

    // Each visit to a position gets a new token, even when returning to the same square layout.
    const interaction = useMemo(() => Symbol(interactionKey), [interactionKey]);
    const activeRef = useRef<symbol | null>(null);
    useLayoutEffect(() => {
        activeRef.current = interaction;
        return () => { activeRef.current = null; };
    }, [interaction]);

    function clearSelection() {
        setSelectedPieceID(null);
    }

    function canInteractNow() {
        const state = useGameStore.getState();
        if (state.gameId !== gameId || state.viewRevision !== viewRevision) return false;
        return analysisMode ? canAnalyzePosition(state) : canPlayCurrentPosition(gameId);
    }

    function getAnalysisBoard() {
        const state = useGameStore.getState();
        const position = getPositionAtPly(state, getNavigationPly(state));
        return position ? { ...position, pieces } : null;
    }

    function selectPiece(pieceID: string, toggle = false) {
        if (activeRef.current !== interaction || pendingPromotion || !canInteractNow()) return;

        const targetPiece = getPieceById(pieces, pieceID);
        if (!targetPiece) return;

        const targetSide = getPieceSide(targetPiece);

        if (targetSide === (analysisMode ? currentTurn : currentUserSide)) {
            if (toggle && selectedPieceID === pieceID) {
                setSelectedPieceID(null);
                return;
            }

            setSelectedPieceID(pieceID);
            return;
        }

        movePiece(targetPiece.square);
    }

    function movePiece(targetSquare: Square, pieceID = selectedPieceID, promotion?: PromotionPiece): boolean {
        if (activeRef.current !== interaction || !canInteractNow() || !gameId || !pieceID) return false;
        if (pendingPromotion && !promotion) return false;
        const analysisBoard = analysisMode ? getAnalysisBoard() : null;
        const { pieces, currentTurn, lastMove } = analysisBoard ?? useGameStore.getState();

        const selectedPiece = getPieceById(pieces, pieceID);
        if (!selectedPiece) return false;

        if (getPieceSide(selectedPiece) !== currentTurn || (!analysisMode && getPieceSide(selectedPiece) !== currentUserSide)) {
            playSound('illegal');
            return false;
        }

        const targetPiece = pieces.find(p => p.square === targetSquare);

        if (targetPiece && getPieceSide(targetPiece) === getPieceSide(selectedPiece)) {
            playSound('illegal');
            return false;
        }

        const allowed = analysisBoard
            ? applyAnalysisMove(analysisBoard, pieceID, targetSquare, promotion ?? analysisPromotion(selectedPiece, targetSquare))
            : canMovePiece(selectedPiece, pieces, targetSquare, lastMove) && isMoveSafe(selectedPiece, pieces, targetSquare);
        if (!allowed) {
            playSound('illegal');
            return false;
        }

        const selectedSide = getPieceSide(selectedPiece);

        const isPromotion =
            selectedPiece.piece[1] === 'p' &&
            (
                (selectedSide === 'white' && targetSquare[1] === '8') ||
                (selectedSide === 'black' && targetSquare[1] === '1')
            );

        if (isPromotion && !promotion) {
            setPendingPromotion({
                pieceID,
                targetSquare,
                side: selectedSide,
            });

            setSelectedPieceID(null);
            return true;
        }

        setSelectedPieceID(null);
        if (analysisMode) return useGameStore.getState().moveInVariation(pieceID, targetSquare, promotion);
        void submitGameMove(gameId, pieceID, targetSquare, promotion);

        return true;
    }

    function cancelPromotion() {
        setPendingPromotion(null);
        setSelectedPieceID(null);
    }

    function choosePromotion(promotion: PromotionPiece) {
        if (!pendingPromotion) return;

        const moved = movePiece(
            pendingPromotion.targetSquare,
            pendingPromotion.pieceID,
            promotion,
        );

        if (moved) {
            setPendingPromotion(null);
        }
    }

    function toggleMarkedSquare(square: Square) {
        setMarkedSquares(cur => cur.includes(square) ? cur.filter(s => s !== square) : [...cur, square]);
    }

    const selectedPiece = selectedPieceID ? getPieceById(pieces, selectedPieceID) : null;

    const analysisBoard = analysisMode ? getAnalysisBoard() : null;
    const availableMoves = selectedPiece && canInteractNow()
        ? getAvailableMoves(selectedPiece, pieces, lastMove, analysisBoard
            ? square => Boolean(applyAnalysisMove(analysisBoard, selectedPiece.id, square, analysisPromotion(selectedPiece, square)))
            : undefined)
        : [];
    
    const isCheck = isKingInCheck(pieces, currentTurn);

    return {
        selectedPieceID,
        selectPiece,
        movePiece,
        availableMoves,
        markedSquares,
        setMarkedSquares,
        toggleMarkedSquare,
        isCheck,
        gameStatus,
        clearSelection,
        pendingPromotion,
        cancelPromotion,
        choosePromotion,
    };
}
