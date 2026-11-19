import s from './styles.module.scss'
import type { PieceType, Square } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { cellSize, squareToPosition } from '../../utils/lib/board';
import { getPieceSide } from '../../utils/lib/getPiece';
import { useLayoutEffect, useRef, useState } from 'react';
import { CHESS_PIECES } from '@/constants/paths';
import clsx from 'clsx';
import { useUserStore } from '@/store/userStore';
import { getAppearance } from '@/utils/getAppearance';

type Props = {
    canInteract: boolean;
    animationPieces?: PieceType[];
    interactionKey: string;
    pieces: PieceType[];
    perspective: Side;
    selectedPieceID: string | null;
    selectPiece: (pieceID: string, toggle?: boolean) => void;
    onSquareClick: (e: React.MouseEvent, square: Square) => void;
    isCheck: boolean;
    currentTurn: Side;
    movePiece: (square: Square, pieceID?: string) => boolean;
    hoveredSquareRef: React.RefObject<Square | null>;
    currentUserSide: Side | null;
}

export default function ChessPieces(props: Props) {
    const user = useUserStore(s => s.user);
    const pieceImages = CHESS_PIECES[getAppearance(user).pieceSet];
    // FEN lists squares in board order. Keep DOM order stable so moving an existing
    // image to another square does not detach it and cancel its CSS transition.
    const animatedPieces = props.pieces.map(piece => ({
        ...piece,
        animationId: props.animationPieces?.find(p => p.square === piece.square && p.piece === piece.piece)?.id ?? piece.id,
    })).sort((a, b) => a.animationId.localeCompare(b.animationId));
    const [noTransitionID, setNoTransitionID] = useState<string | null>(null);
    
    const suppressClickRef = useRef(false);
    const wasSelectedOnMouseDownRef = useRef(false);
    const cancelDragRef = useRef<(() => void) | null>(null);
    useLayoutEffect(() => {
        suppressClickRef.current = false;
        wasSelectedOnMouseDownRef.current = false;
        return () => { cancelDragRef.current?.(); };
    }, [props.interactionKey]);

    function handlePieceClick(e: React.MouseEvent, square: Square, id: string) {
        e.stopPropagation();
        if (!props.canInteract) return;

        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            wasSelectedOnMouseDownRef.current = false;
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            wasSelectedOnMouseDownRef.current = false;
            props.onSquareClick(e, square);
            return;
        }

        props.selectPiece(id, wasSelectedOnMouseDownRef.current);
        wasSelectedOnMouseDownRef.current = false;
    }

    function handlePieceMouseDown(
        e: React.MouseEvent<HTMLImageElement>,
        id: string,
        fromSquare: Square,
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (!props.canInteract) return;
        cancelDragRef.current?.();

        wasSelectedOnMouseDownRef.current = props.selectedPieceID === id;
        props.selectPiece(id);

        const img = e.currentTarget;

        const rect = img.getBoundingClientRect();
        const centerOffsetX = e.clientX - (rect.left + rect.width / 2);
        const centerOffsetY = e.clientY - (rect.top + rect.height / 2);

        const board = img.closest<HTMLElement>('[data-chess-board]');
        if (!board) return;

        const boardRect = board.getBoundingClientRect();
        const overflow = rect.width * 0.25;

        const start = {
            transform: img.style.transform,
            transition: img.style.transition,
            zIndex: img.style.zIndex,
        };

        const startMouse = {
            x: e.clientX,
            y: e.clientY,
        };

        let isDragging = false;

        img.style.transition = 'none';
        img.style.zIndex = '1000';
        // document.body.style.cursor = 'grabbing';

        function move(ev: MouseEvent) {
            const mouseDx = ev.clientX - startMouse.x;
            const mouseDy = ev.clientY - startMouse.y;

            if (Math.abs(mouseDx) > 3 || Math.abs(mouseDy) > 3) {
                isDragging = true;
            }

            const rawDx = mouseDx + centerOffsetX;
            const rawDy = mouseDy + centerOffsetY;

            const dx = Math.max(
                boardRect.left - rect.left - overflow,
                Math.min(rawDx, boardRect.right - rect.right + overflow),
            );

            const dy = Math.max(
                boardRect.top - rect.top - overflow,
                Math.min(rawDy, boardRect.bottom - rect.bottom + overflow),
            );

            img.style.transform = `translate(${dx}px, ${dy}px)`;
        }

        function cancelDrag() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);

            img.style.transform = start.transform;
            img.style.transition = start.transition;
            img.style.zIndex = start.zIndex;
            document.body.style.cursor = '';
            cancelDragRef.current = null;
        }

        function up() {
            cancelDrag();
            const targetSquare = props.hoveredSquareRef.current;
            
            if (isDragging) {
                suppressClickRef.current = true;
            }
            
            if (isDragging && targetSquare && targetSquare !== fromSquare) {
                setNoTransitionID(id);
                props.movePiece(targetSquare, id);
                
                requestAnimationFrame(() => {
                    setNoTransitionID(null);
                });
            }
        }

        move(e.nativeEvent);

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
        cancelDragRef.current = cancelDrag;
    }

    return (
        <div className={s.chess_pieces}>
            {animatedPieces.map(({ id, piece, square, animationId }) => {
                const { left, top } = squareToPosition(square, props.perspective);
                const isKing = piece[1] === 'k';
                const side = getPieceSide({ id, piece, square });
                const isCheckedKing = props.isCheck && isKing && side === props.currentTurn;

                return (
                    <img
                        key={animationId}
                        src={pieceImages[piece]}
                        alt={`${piece} on ${square}`}
                        draggable={false}
                        className={clsx(
                            s.piece,
                            !props.canInteract && s.readOnly,
                            isCheckedKing && s.check,
                            noTransitionID === id && s.noTransition
                        )}
                        style={{
                            width: `${cellSize}%`,
                            height: `${cellSize}%`,
                            left: `${left}%`,
                            top: `${top}%`,
                        }}
                        onClick={(e) => handlePieceClick(e, square, id)}
                        onMouseDown={(e) => {
                            if (!props.canInteract || e.button !== 0 || e.ctrlKey || e.metaKey) return;
                            if (!props.currentUserSide) return;
                            if (side !== props.currentUserSide) return;

                            handlePieceMouseDown(e, id, square);
                        }}
                    />
                );
            })}
        </div>
    )
}
