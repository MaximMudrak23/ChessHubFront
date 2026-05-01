import s from './styles.module.scss'
import UserAvatar from '../UserAvatar'
import UserName from '../UserName'
import clsx from 'clsx';

type Props = 
    | {
        variation: 'header';
        imgURL?: string;
        frameURL?: string;
        userName: string;
        userIcons?: string[];
        userRole: string;
    }
    | {
        variation: 'card';
        imgURL?: string;
        frameURL?: string;
        userName: string;
        userIcons?: string[];
        userElo: number;
        isActive?: boolean;
    }

export default function UserCard(props: Props) {
    return (
        <section className={clsx(s.userCard, props.variation === 'card' && props.isActive && s.active)}>
            <UserAvatar
                imgURL={props.imgURL}
                userName={props.userName}
                size={64}
                frameURL={props.frameURL}
                className={s.usercard_avatar}
            />
            <UserName
                userName={props.userName}
                variation='card'
                className={s.usercard_name}
                Icons={props.userIcons}
            />
            
            {props.variation === 'card' &&
                <div className={s.elo_folder}>
                    <span>{props.userElo} elo</span>
                </div>
            }
            {props.variation === 'header' &&
                <p className={s.usercard_role}>
                    <span>{props.userRole}</span>
                </p>
            }
        </section>
    )
}