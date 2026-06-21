import s from './styles.module.scss'
import Button from '@/components/UI/Button'
import { useState } from 'react';

type Props = {
    keyValue: string;
    onDelete: () => void;
}

export default function KeyCard(props: Props) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(props.keyValue);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }
    
    return (
        <div className={s.key_card}>
            <p className={s.title}>Code</p>
            <p className={s.value}>{props.keyValue}</p>
            <Button
                text={copied ? 'Copied!' : 'Copy'}
                variant='profile'
                animation='white-hover'
                onClick={handleCopy}
                className={s.button}
            />
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