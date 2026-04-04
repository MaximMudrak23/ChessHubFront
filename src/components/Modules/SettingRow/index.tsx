import s from './styles.module.scss'
import Toggle from '../../UI/Toggle'
import clsx from 'clsx'

type Props = {
    title: string;
    toggleIsChecked: boolean;
    toggleOnChangeHandler: (value: boolean) => void;
    children?: React.ReactNode;
    childrenAlt?: string;
}

export default function SettingRow({title, toggleIsChecked, toggleOnChangeHandler, children, childrenAlt = 'Here should be content...'}: Props) {
    return (
        <div className={s.setting_row_container}>
            <div className={s.setting_header}>
                <Toggle isChecked={toggleIsChecked} onChangeHandler={toggleOnChangeHandler} />
                <span className={clsx(s.setting_title, !toggleIsChecked ? s.closed : false)}>{title}</span>
            </div>
            <div className={clsx(s.setting_content, !toggleIsChecked ? s.closed : false)}>
                {children ?? <p>{childrenAlt}</p>}
            </div>
        </div>
    )
}