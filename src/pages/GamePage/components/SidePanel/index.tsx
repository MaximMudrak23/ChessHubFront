import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'
import UserCard from '../../../../components/User/UserCard';
import MoveRow from './MoveRow';
import type { Players, Move } from './utils/items.types';

const actionButtons = [
    {icon: '/all/ar1.svg', onClick: () => {}},
    {icon: '/all/ar2.svg', onClick: () => {}},
    {icon: '/all/flag.svg', onClick: () => {}},
    {icon: '/all/draw.svg', onClick: () => {}},
];

type Props = {
    players: Players;
    moves?: Move[];
}

export default function SidePanel({players, moves}: Props) {
    const orderedUsers = players.black.isCurrentUser ? [players.white, players.black] : [players.black, players.white];

    return (
        <div className={s.side_panel}>
            <div className={s.users_folder}>
                {orderedUsers.map(user => (
                    <UserCard
                        key={user.userName}
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
                    {moves && moves.map(({whiteMove, blackMove}, i) => (
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