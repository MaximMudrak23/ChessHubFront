import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'
import UserCard from '../../../../components/User/UserCard';
import MoveRow from './components/MoveRow';
import type { Players, Side, Move } from '../../utils/types/game.types';
import { getSortedUsers } from './utils/getSortedUsers';

const actionButtons = [
    {icon: '/all/ar1.svg', onClick: () => {}},
    {icon: '/all/ar2.svg', onClick: () => {}},
    {icon: '/all/flag.svg', onClick: () => {}},
    {icon: '/all/draw.svg', onClick: () => {}},
];

type Props = {
    players: Players;
    perspective: Side;
    moves?: Move[];
}

export default function SidePanel({players, perspective, moves = []}: Props) {
    const sortedUsers = getSortedUsers(players, perspective);

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
                    />
                ))}
            </div>

            <div className={s.moves_folder}>
                <div className={s.title}> <img src="/all/chess.svg" alt="Moves Folder Title Icon" draggable={false} /> </div>
                <div className={s.moves}>
                    {moves.map(({whiteMove, blackMove}, i) => (
                        <MoveRow
                            key={i}
                            moveNumber={i+1}
                            whiteMove={whiteMove}
                            blackMove={blackMove}
                        />
                    ))}
                </div>
            </div>

            <div className={s.buttons_folder}>
                {actionButtons.map(({icon, onClick}, i) => (
                    <Button
                        key={i}
                        icon={icon}
                        variant={'black'}
                        onClick={onClick}
                        className={s.button}
                    />
                ))}
            </div>
        </div>
    )
}