import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { Side } from '../../../../utils/types/game.types';
import type { Square } from '../../utils/types/chess.types';
import { boardSize, coordsToSquare, squareToPosition } from '../../utils/lib/board';
import s from './styles.module.scss';

type Arrow = { from: Square; to: Square };

type Props = {
    boardRef: RefObject<HTMLDivElement | null>;
    perspective: Side;
    interactionKey: string;
    onToggleSquare: (square: Square) => void;
};

export default function BoardArrows({ boardRef, perspective, interactionKey, onToggleSquare }: Props) {
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const [preview, setPreview] = useState<Arrow | null>(null);
    const gestureKey = `${interactionKey}:${perspective}`;
    const [previousGestureKey, setPreviousGestureKey] = useState(gestureKey);
    if (previousGestureKey !== gestureKey) {
        setPreviousGestureKey(gestureKey);
        setPreview(null);
    }

    useEffect(() => {
        const board = boardRef.current;
        if (!board) return;

        let start: Square | null = null;
        let pointerId: number | null = null;
        let movedFromStart = false;

        function getSquare(event: PointerEvent): Square | null {
            const rect = boardRef.current?.getBoundingClientRect();
            if (!rect) return null;
            const col = Math.floor((event.clientX - rect.left) / rect.width * boardSize);
            const row = Math.floor((event.clientY - rect.top) / rect.height * boardSize);
            if (col < 0 || col >= boardSize || row < 0 || row >= boardSize) return null;

            return perspective === 'black'
                ? coordsToSquare(boardSize - 1 - row, boardSize - 1 - col)
                : coordsToSquare(row, col);
        }

        function cancel() {
            start = null;
            setPreview(null);
            if (pointerId !== null && board?.hasPointerCapture(pointerId)) {
                board.releasePointerCapture(pointerId);
            }
            pointerId = null;
        }

        function down(event: PointerEvent) {
            if (event.button !== 2 || (event.buttons & 1) !== 0 || pointerId !== null) return;
            event.preventDefault();
            start = getSquare(event);
            if (!start) return;
            movedFromStart = false;
            pointerId = event.pointerId;
            board?.setPointerCapture(pointerId);
        }

        function move(event: PointerEvent) {
            if (!start || event.pointerId !== pointerId) return;
            if ((event.buttons & 2) === 0) {
                cancel();
                return;
            }
            const to = getSquare(event);
            if (to !== start) movedFromStart = true;
            setPreview(to && to !== start ? { from: start, to } : null);
        }

        function up(event: PointerEvent) {
            if (event.button !== 2 || !start || event.pointerId !== pointerId) return;
            const from = start;
            const to = getSquare(event);
            cancel();
            if (!to) return;
            if (to === from) {
                if (!movedFromStart) onToggleSquare(to);
                return;
            }

            setArrows(current => current.some(arrow => arrow.from === from && arrow.to === to)
                ? current.filter(arrow => arrow.from !== from || arrow.to !== to)
                : [...current, { from, to }]);
        }

        function preventContextMenu(event: MouseEvent) {
            event.preventDefault();
        }

        board.addEventListener('pointerdown', down, true);
        board.addEventListener('contextmenu', preventContextMenu);
        board.addEventListener('lostpointercapture', cancel);
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
        document.addEventListener('pointercancel', cancel);
        window.addEventListener('blur', cancel);
        return () => {
            board.removeEventListener('pointerdown', down, true);
            board.removeEventListener('contextmenu', preventContextMenu);
            board.removeEventListener('lostpointercapture', cancel);
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
            document.removeEventListener('pointercancel', cancel);
            window.removeEventListener('blur', cancel);
            if (pointerId !== null && board.hasPointerCapture(pointerId)) {
                board.releasePointerCapture(pointerId);
            }
        };
    }, [boardRef, perspective, interactionKey, onToggleSquare]);

    const visibleArrows = preview
        ? [...arrows.filter(arrow => arrow.from !== preview.from || arrow.to !== preview.to), preview]
        : arrows;

    return (
        <svg className={s.board_arrows} viewBox="0 0 800 800" aria-hidden="true">
            {visibleArrows.map(({ from, to }) => {
                const origin = squareToPosition(from, perspective);
                const target = squareToPosition(to, perspective);
                const dx = (target.left - origin.left) * 8;
                const dy = (target.top - origin.top) * 8;
                const length = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                return (
                    <path
                        key={`${from}-${to}`}
                        transform={`translate(${origin.left * 8 + 50} ${origin.top * 8 + 50}) rotate(${angle})`}
                        d={`M 0 -7.5 H ${length - 30} V -20 L ${length} 0 L ${length - 30} 20 V 7.5 H 0 A 7.5 7.5 0 0 1 0 -7.5 Z`}
                    />
                );
            })}
        </svg>
    );
}
