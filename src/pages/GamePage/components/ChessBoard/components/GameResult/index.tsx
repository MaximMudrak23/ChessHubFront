import s from './styles.module.scss'
import Button from '../../../../../../components/UI/Button';
import type { GameStatus } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    isGameEnded: boolean;
    gameStatus: GameStatus;
    winnerSide: Side | null;
}

export default function GameResult({isGameEnded, gameStatus, winnerSide}: Props) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (gameStatus !== 'playing') {
            setIsOpen(true);
        }
    }, [gameStatus])

    return (
        <div className={clsx(s.game_result, isOpen && isGameEnded && s.active)}>
            <button
                className={s.close_button}
                onClick={() => setIsOpen(false)}
            />

            {gameStatus === 'checkmate' && winnerSide &&
                <p className={s.result_table}>{winnerSide.toUpperCase()} WINS!</p>
            }
            {gameStatus === 'stalemate' &&
                <p className={s.result_table}>Draw! Stalemate</p>
            }
            {gameStatus === 'fifty-move-draw' &&
                <p className={s.result_table}>Draw! 50-move rule</p>
            }
            {gameStatus === 'threefold-repetition-draw' &&
                <p className={s.result_table}>Draw! Threefold repetition</p>
            }
            {gameStatus === 'insufficient-material-draw' &&
                <p className={s.result_table}>Draw! Insufficient material</p>
            }
            {gameStatus === 'resignation' && (
                <p className={s.result_table}>Game ended by resignation</p>
            )}

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
        </div>
    )
}