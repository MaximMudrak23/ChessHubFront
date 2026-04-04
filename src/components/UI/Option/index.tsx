import s from './styles.module.scss'
import clsx from 'clsx'

type Props = {
    name: string;
    imgURL?: string;
    
    isActive?: boolean;
    isDisabled?: boolean;
    isGlow?: boolean;
    
    fontSize?: 'small' | 'medium' | 'high';
    lineAxis: 'vertical' | 'horizontal';
    onClick: () => void;
}

export default function Option({
    name,
    imgURL,
    isActive,
    isGlow,
    isDisabled,
    fontSize,
    lineAxis,
    onClick
}: Props) {
    return (
        <button
            type={'button'}
            aria-pressed={isActive}
            
            className={clsx(s.option, s[fontSize ?? 'small'], s[lineAxis], {[s.active]: isActive, [s.glow]: isGlow})}

            disabled={isDisabled}
            onClick={onClick}
        >
            {imgURL && <img src={imgURL} alt={name} draggable={false} />}
            <span>{name}</span>
        </button>
    )
}