import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'
import UserAvatar from '../../../../components/User/UserAvatar'

type Props = {
    imgURL?: string;
    frameURL?: string;
    username: string;
    regDate: string;
    id: number;
    login: string;
    mail: string;
    role: 'Admin' | 'User' | 'Bot';
    lastSeen: string;
    isBanned: boolean;
}

export default function Card(props: Props) {
    const infoRows = [
        { title: 'ID:', value: props.id },
        { title: 'Login:', value: props.login },
        { title: 'Mail:', value: props.mail },
        { title: 'Role:', value: props.role },
        { title: 'Last seen:', value: props.lastSeen },
        { title: 'Banned:', value: props.isBanned ? 'Yes' : 'No' },
    ]

    return (
        <div className={s.card}>
            <header className={s.header}>
                <div className={s.avatar_container}>
                    <UserAvatar
                        size={100}
                        userName={props.username}
                        imgURL={props.imgURL}
                        frameURL={props.frameURL}
                    />
                </div>

                <div className={s.text_container}>
                    <div className={s.username}><span>{props.username}</span></div>
                    <div className={s.regdate}><span>{props.regDate}</span></div>
                </div>
            </header>

            <div className={s.info}>
                {infoRows.map(row => (
                    <div key={row.title} className={s.row}>
                        <span className={s.title}>{row.title}</span>
                        <span className={s.value}>{row.value}</span>
                    </div>
                ))}
            </div>

            <footer className={s.action_button}>
                <Button
                    text={'More Actions'}
                    variant={'green'}
                    onClick={()=>''}
                    styleProps={{width: '100%', borderRadius: 5}}
                />
            </footer>
        </div>
    )
}