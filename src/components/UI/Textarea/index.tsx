import s from './styles.module.scss'
import clsx from 'clsx';

type Variant = 'grey' | 'profile';

type Props = {
    value: string;
    onChangeHandler: (value: string) => void;

    id: string;
    name?: string;

    variant: Variant;
    placeholderText?: string;

    className?: string;
    styleProps?: React.CSSProperties;
}

export default function Textarea(propsOBJ: Props) {
    return (
        <div
            className={clsx(
                propsOBJ.className,
                s.textareaContainer,
            )}
            style={propsOBJ.styleProps}
        >
            <textarea
                id={propsOBJ.id}
                name={propsOBJ.name}
                className={clsx(
                    s.textarea,
                    s[`textarea--${propsOBJ.variant}`],
                )}
                placeholder={propsOBJ.placeholderText}
                value={propsOBJ.value}
                onChange={(e) => propsOBJ.onChangeHandler(e.target.value)}
            />
        </div>
    )
}