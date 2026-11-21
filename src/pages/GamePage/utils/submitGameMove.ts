import { GameMoveError, getGameById, makeMove } from '@/api/gameApi';
import { getSocketSessionVersion } from '@/socket/socket';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { mapServerGameToClientGame } from '@/utils/mapServerGameToClientGame';
import type { PromotionPiece, Square } from '../components/ChessBoard/utils/types/chess.types';

import { applyAnalysisMove } from './analysisVariation';
import { CASTLING_ROOK_RIGHTS } from './moveNavigation';

let submissionNumber = 0;

export function canPlayCurrentPosition(gameId: string | null): boolean {
    const game = useGameStore.getState();
    const { user, token } = useUserStore.getState();
    return Boolean(gameId && game.gameId === gameId && game.isActive && game.gameStatus === 'playing' &&
        game.selectedPly === null && !game.variation && !game.isMovePending && token && user &&
        game.players?.[game.currentTurn].userId === String(user.id));
}

export async function submitGameMove(
    gameId: string,
    pieceID: string,
    targetSquare: Square,
    promotion?: PromotionPiece,
) {
    if (!canPlayCurrentPosition(gameId)) return;
    const game = useGameStore.getState();
    const token = useUserStore.getState().token!;
    const piece = game.pieces.find(piece => piece.id === pieceID);
    if (!piece || piece.piece[0] !== (game.currentTurn === 'white' ? 'w' : 'b')) return;

    const session = getSocketSessionVersion();
    const submission = ++submissionNumber;
    const isCurrent = () => submission === submissionNumber && session === getSocketSessionVersion() &&
        useGameStore.getState().gameId === gameId;
    // Preview only: recorded moves, history and revision remain server-owned.
    const lastMove = game.lastMove;
    const enPassant = lastMove?.piece[1] === 'p' && Math.abs(Number(lastMove.from[1]) - Number(lastMove.to[1])) === 2
        ? `${lastMove.to[0]}${(Number(lastMove.from[1]) + Number(lastMove.to[1])) / 2}` as Square : null;
    const preview = applyAnalysisMove({
        pieces: game.pieces,
        currentTurn: game.currentTurn,
        lastMove,
        enPassant: game.navigationPositions?.[game.latestPly]?.enPassant ?? enPassant,
        castlingRights: game.navigationPositions?.[game.latestPly]?.castlingRights ?? game.pieces
            .filter(p => p.piece[1] === 'r' && !p.hasMoved)
            .map(p => CASTLING_ROOK_RIGHTS[p.square] ?? '').join(''),
        sound: null,
    }, pieceID, targetSquare, promotion);
    useGameStore.setState({
        isMovePending: true, moveError: null,
        ...(preview && { pieces: preview.pieces, currentTurn: preview.currentTurn, lastMove: preview.lastMove }),
    });
    try {
        const response = await makeMove(token, { gameId, pieceID, targetSquare, promotion });
        // A socket update (including a bot reply) can arrive before the HTTP response.
        if (isCurrent() && useGameStore.getState().revision === game.revision) {
            game.setGame(mapServerGameToClientGame(response.game));
        }
    } catch (error) {
        if (!isCurrent()) return;
        if (useGameStore.getState().revision === game.revision) {
            useGameStore.setState({ pieces: game.pieces, currentTurn: game.currentTurn, lastMove: game.lastMove });
        }
        let message = error instanceof Error ? error.message : 'Failed to make move';
        if (error instanceof GameMoveError && error.status === 409) {
            const revision = useGameStore.getState().revision;
            try {
                const { game: snapshot } = await getGameById(gameId);
                if (isCurrent() && useGameStore.getState().revision === revision) {
                    game.setGame(mapServerGameToClientGame(snapshot));
                }
            } catch {
                message += ' Could not reload the game. Please refresh the page.';
            }
        }
        if (isCurrent()) useGameStore.setState({ moveError: message });
    } finally {
        if (isCurrent()) useGameStore.setState({ isMovePending: false });
    }
}
