import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'
import UserCard from '../../../../components/User/UserCard';
import MoveRow from './components/MoveRow';

// зарефакторить потом, переделать сортировку и в целом пройтись по коду и стилям и причесать все
// потом все в пропсы сайдпанели вынести, игроков и так далее, чтоб не засорять внутри

const buttonsFolderItems = [
    {icon: '/all/ar1.svg', onClick: () => {}},
    {icon: '/all/ar2.svg', onClick: () => {}},
    {icon: '/all/flag.svg', onClick: () => {}},
];

const usersFolderItems = [
    {
        side: 'white',
        isCurrentUser: false,
        imgURL: '/special/ygritte.jpg',
        frameURL: '/steam/steam2.png',
        userName: "Snow's Mirror",
        userElo: 2000,
        userIcons: ['/all/RED BULL.svg']
    },
    {
        side: 'black',
        isCurrentUser: true,
        imgURL: '/special/ygritte.png',
        frameURL: '/steam/steam2.png',
        userName: 'Snow',
        userElo: 2000,
        userIcons: ['/all/RED BULL.svg']
    },
];

const movesFolderItems = [
    {whiteMove: 'e4', blackMove: 'e5'},
    {whiteMove: 'd4', blackMove: 'cxd4'},
    {whiteMove: 'a4'},
];

export default function SidePanel() {
    const opponent = usersFolderItems.find(user => !user.isCurrentUser)!;
    const currentUser = usersFolderItems.find(user => user.isCurrentUser)!;
    const orderedUsers = [opponent, currentUser];

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
                    {movesFolderItems.map(({whiteMove, blackMove}, i) => (
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
                {buttonsFolderItems.map(({icon, onClick}, i) => (
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