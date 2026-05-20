import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'
import UserAvatar from '@/components/User/UserAvatar'
import UserName from '@/components/User/UserName';
import type { IconType } from '@/types/user.types'
import { useNavigate } from 'react-router-dom';

type Props = {
    id: string;
    username: string;
    description?: string;
    imgURL?: string;
    frameURL?: string;
    userIcons?: IconType[];
}

export default function FindCard(props: Props) {
    const navigate = useNavigate();

    return (
        <div className={s.find_card}>
            <UserAvatar
                userName={`${props.username} Avatar`}
                size={100}
                imgURL={props.imgURL}
                frameURL={props.frameURL}
            />

            <div className={s.text_container}>
                <UserName
                    userName={props.username}
                    variation="card"
                    Icons={props.userIcons}
                    className={s.username}
                />
                <p className={s.description}>{props.description}</p>
            </div>

            <div className={s.button_container}>
                <Button
                    text={'Open Profile'}
                    variant='black'
                    animation='white-hover'
                    onClick={() => navigate(`/profile/${props.id}`)}
                    styleProps={{padding: '12px', borderRadius: '10px'}}
                />
            </div>
        </div>
    )
}