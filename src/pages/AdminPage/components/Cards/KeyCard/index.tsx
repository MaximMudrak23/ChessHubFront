import s from './styles.module.scss'
import Button from '@/components/UI/Button'

type Props = {
    keyValue: string;
    onDelete: () => void;
}

export default function KeyCard(props: Props) {
    return (
        <div className={s.key_card}>
            <p className={s.title}>Code</p>
            <p className={s.value}>{props.keyValue}</p>
            <Button
                text='Delete'
                variant='profile'
                animation='white-hover'
                onClick={props.onDelete}
                className={s.button}
            />
        </div>
    )
}