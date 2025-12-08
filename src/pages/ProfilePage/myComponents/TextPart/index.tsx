import s from './styles.module.scss'
import UserName from '../../../../shared/ForFetch/UserName';
import UserDescription from '../../../../shared/ForFetch/UserDescription';

type Props = {
    username: string;
    usernameIcons?: string[];
    description?: string;
}

export default function TextPart({username, usernameIcons, description}: Props) {
    return (
        <div className={s.profileContainerText}>
            <UserName username={username} usernameIcons={usernameIcons} />
            <UserDescription description={description} />
        </div>
    )
}