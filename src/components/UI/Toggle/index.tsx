import s from './styles.module.scss'

// type Variant = 'default' | 'gradient';

type Props = {
   isChecked: boolean;
   onChangeHandler: (value: boolean) => void;
}

export default function Toggle({isChecked, onChangeHandler}: Props) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Предотвращаем возможную отправку формы
            onChangeHandler(!isChecked);
        }
    }

    return (
        <label className={s.toggle}>
            <input
                type="checkbox"
                checked={isChecked}
                onChange={e => onChangeHandler(e.target.checked)}
                onKeyDown={handleKeyDown}
            />
            <p />
        </label>
    )
}