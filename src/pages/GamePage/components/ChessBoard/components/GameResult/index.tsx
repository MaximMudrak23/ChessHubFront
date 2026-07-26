import s from './styles.module.scss'
import Button from '../../../../../../components/UI/Button';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import type { GameStatus } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import { SVG } from '@/constants/paths';

type Props = {
    isGameEnded: boolean;
    gameStatus: GameStatus;
    winnerSide: Side | null;
    currentUserSide: Side | null;
}

export default function GameResult({
    isGameEnded,
    gameStatus,
    winnerSide,
    currentUserSide,
}: Props) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(isGameEnded);
    }, [isGameEnded]);

    const isSpectator = currentUserSide === null;
    const isDraw = gameStatus.includes('draw') || gameStatus === 'stalemate';
    const isWinner =
        currentUserSide !== null &&
        winnerSide === currentUserSide;

    let title = '';
    let reason = '';

    if (isDraw) {
        title = 'Draw!';

        const drawReasons: Partial<Record<GameStatus, string>> = {
            stalemate: 'Stalemate',
            'fifty-move-draw': '50-move rule',
            'threefold-repetition-draw': 'Threefold repetition',
            'insufficient-material-draw': 'Insufficient material',
        };

        reason = drawReasons[gameStatus] ?? '';
    } else if (winnerSide) {
        if (isSpectator) {
            title = `${winnerSide === 'white' ? 'White' : 'Black'} wins!`;
        } else {
            title = isWinner ? 'You won!' : 'You lost!';
        }

        if (gameStatus === 'checkmate') {
            reason = 'Checkmate';
        }

        if (gameStatus === 'resignation' && winnerSide) {
            const loserSide =
                winnerSide === 'white' ? 'Black' : 'White';

            reason = `${loserSide} resignation`;
        }
    }

    return (
        <>
            <div
                className={clsx(s.board_background, isOpen && s.active)}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            />

            <motion.div
                className={clsx(s.game_result, isOpen && isGameEnded && s.active)}
                initial={false}
                animate={{
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : 35,
                    scale: isOpen ? 1 : 0.96,
                }}
                transition={
                    isOpen
                        ? {
                            type: 'spring',
                            stiffness: 220,
                            damping: 14,
                            mass: 0.8,
                        }
                        : {
                            duration: 0.18,
                            ease: 'easeIn',
                        }
                }
                onMouseMove={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={s.close_button}
                    onClick={() => setIsOpen(false)}
                />

                <div className={s.result_table}>
                    <p className={s.result_title}>
                        {isWinner && (
                            <img
                                className={s.result_icon}
                                src={SVG.cup}
                                alt="Cup Icon"
                            />
                        )}

                        <span>{title}</span>
                    </p>

                    <p className={s.result_reason}>By {reason}</p>
                </div>

                <div className={s.button_folder}>
                    <Button
                        text={'Main Menu'}
                        variant={'green'}
                        styleProps={{
                            width: '75%',
                            height: '50%',
                            fontWeight: '500',
                            borderRadius: '5px',
                        }}
                        onClick={() => navigate('/main')} 
                    />
                </div>
            </motion.div>
        </>
    );
}