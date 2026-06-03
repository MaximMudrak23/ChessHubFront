import s from './styles.module.scss'
import UserCard from '../../../../components/User/UserCard';
import MoveRow from './components/MoveRow';
import Button from '@/components/UI/Button';
import type { Players, Side, Move } from '../../utils/types/game.types';
import { getSortedUsers } from './utils/getSortedUsers';
import { useEffect, useRef } from 'react';
import { SVG } from '@/constants/paths';
import { useResignGame } from '../../hooks/useResignGame';

type Props = {
    players: Players;
    perspective: Side;
    moves?: Move[];
    currentTurn: Side;
}

export default function SidePanel(props: Props) {
    const {canResign, resignGame} = useResignGame();

    const sortedUsers = getSortedUsers(props.players, props.perspective);
    const movesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = movesRef.current;
        if (!el) return;
        el.scrollTo({top: el.scrollHeight, behavior: 'smooth'});
    }, [props.moves?.length]);

    return (
        <div className={s.side_panel}>
            <div className={s.users_folder}>
                {sortedUsers.map(user => (
                    <UserCard
                        key={user.side}
                        imgURL={user.imgURL}
                        frameURL={user.frameURL}
                        userName={user.userName}
                        userIcons={user.userIcons}
                        userElo={user.userElo}
                        variation={'card'}
                        isActive={user.side === props.currentTurn}
                    />
                ))}
            </div>

            <div className={s.moves_folder}>
                <div className={s.title}>
                    <img src={SVG.chessboard} alt="Moves Folder Title Icon" draggable={false} />
                </div>
                <div className={s.moves} ref={movesRef}>
                    {props.moves && props.moves.map(({whiteMove, blackMove}, i) => (
                        <MoveRow
                            key={i}
                            moveNumber={i+1}
                            whiteMove={whiteMove}
                            blackMove={blackMove}
                        />
                    ))}
                </div>
            </div>

            {canResign &&
                <div className={s.button_folder}>
                    <Button
                        text={'Resign'}
                        active={true}
                        variant='black'
                        animation='white-hover'
                        onClick={resignGame}
                        styleProps={{
                            height: '65%',
                            width: '100px',
                            borderRadius: '5px',
                        }}
                    />
                </div>
            }
        </div>
    )
}