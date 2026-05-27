import s from './styles.module.scss'
import type { PieceType, Square } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { cellSize, squareToPosition } from '../../utils/lib/board';
import { getPieceSide } from '../../utils/lib/getPiece';
import { useState } from 'react';
import { CHESS_PIECES } from '@/constants/paths';
import clsx from 'clsx';

type Props = {
    pieces: PieceType[];
    perspective: Side;
    selectPiece: (pieceID: string) => void;
    onSquareClick: (e: React.MouseEvent, square: Square) => void;
    isCheck: boolean;
    currentTurn: Side;
    movePiece: (square: Square, pieceID?: string) => boolean;
    hoveredSquareRef: React.RefObject<Square | null>;
    currentUserSide: Side | null;
}

export default function ChessPieces(props: Props) {
    const [noTransitionID, setNoTransitionID] = useState<string | null>(null);
   
    function handlePieceClick(e: React.MouseEvent, square: Square, id: string) {
        if (e.ctrlKey || e.metaKey) {
            props.onSquareClick(e, square);
            return;
        }
        props.selectPiece(id);
    }

    function handlePieceMouseDown(
        e: React.MouseEvent<HTMLImageElement>,
        id: string,
        fromSquare: Square,
        side: Side
    ) {
        e.preventDefault();
        e.stopPropagation();

        props.selectPiece(id);

        const img = e.currentTarget;

        const rect = img.getBoundingClientRect();
        const centerOffsetX = e.clientX - (rect.left + rect.width / 2);
        const centerOffsetY = e.clientY - (rect.top + rect.height / 2);

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
        document.body.style.cursor = 'grabbing';

        function move(ev: MouseEvent) {
            const dx = ev.clientX - startMouse.x + centerOffsetX;
            const dy = ev.clientY - startMouse.y + centerOffsetY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                isDragging = true;
            }

            img.style.transform = `translate(${dx}px, ${dy}px)`;
        }

        function up() {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);

            img.style.transform = start.transform;
            img.style.transition = start.transition;
            img.style.zIndex = start.zIndex;
            document.body.style.cursor = '';

            const targetSquare = props.hoveredSquareRef.current;
            if (isDragging && targetSquare && targetSquare !== fromSquare) {
                if (side !== props.currentTurn) return;

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
    }

    return (
        <div className={s.chess_pieces}>
            {props.pieces.map(({ id, piece, square }) => {
                const { left, top } = squareToPosition(square, props.perspective);
                const isKing = piece[1] === 'k';
                const side = getPieceSide({ id, piece, square });
                const isCheckedKing = props.isCheck && isKing && side === props.currentTurn;

                return (
                    <img
                        key={id}
                        src={CHESS_PIECES.default[piece]}
                        alt={`${piece} on ${square}`}
                        draggable={false}
                        className={clsx(
                            s.piece,
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
                            if (!props.currentUserSide) return;
                            if (side !== props.currentUserSide) return;

                            handlePieceMouseDown(e, id, square, side);
                        }}
                    />
                );
            })}
        </div>
    )
}