import s from './styles.module.scss'

type Props = {
    radioName: string;
    value: string;
    group: string;
    checked: boolean;
    isActive: boolean;
    onChangeHandler: (value: string) => void;
}

export default function RadioButton({radioName, value, group, checked, isActive, onChangeHandler}: Props) {
    return (
        <label className={s.radio_button_container}>
            <input
                type="radio"
                name={group}
                value={value}
                checked={checked}
                tabIndex={isActive ? 0 : -1}
                onChange={e => onChangeHandler(e.target.value)}
            />
            <div className={s.radio_circle} />
            <span className={s.radio_name}>{radioName}</span>
        </label>
    )
}