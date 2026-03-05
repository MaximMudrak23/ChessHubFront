import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'

type Props = {
    imgURL: string;
    username: string;
    description?: string;
    isFriend?: boolean;
}

export default function FindCard({imgURL, username, isFriend, description}: Props) {
    return (
        <div className={s.find_card}>
            <img src={imgURL} alt={`${username} PFP`} />
            <div className={s.text_info}>
                <p className={s.username}>{username}</p>
                <p className={s.description}>{description}</p>
            </div>
            <Button
                variant='black'
                text={isFriend ? 'YOUR FRIEND' : 'ADD FRIEND'}
                onClick={()=>''}
                active={!isFriend}
                styleProps={{padding: '12px', borderRadius: '10px'}}
            />
        </div>
    )
}