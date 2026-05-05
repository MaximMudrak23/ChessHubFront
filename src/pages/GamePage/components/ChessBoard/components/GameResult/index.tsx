import s from './styles.module.scss'
import Button from '../../../../../../components/UI/Button';
import type { GameStatus } from '../../utils/types/chess.types';
import type { Side } from '../../../../utils/types/game.types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

type Props = {
    isGameEnded: boolean;
    gameStatus: GameStatus;
    winnerSide: Side | null;
}

export default function GameResult({isGameEnded, gameStatus, winnerSide}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if(gameStatus === 'checkmate' || gameStatus === 'stalemate') {
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
                    onClick={()=>{}}
                />
            </div>
        </div>
    )
}