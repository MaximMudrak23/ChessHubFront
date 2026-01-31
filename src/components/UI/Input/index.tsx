import s from './styles.module.scss'

type Type =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'checkbox'
    | 'radio'
    | 'submit';

type Shape =
    | 'welcome_shape';

type Props = {
    type: Type;
    shape: Shape;
    id: string;
    placeholderText?: string;

    value: string;
    onChangeX: (value: string) => void;
}

export default function Input(propsOBJ: Props) {
    const shape = s[propsOBJ.shape];
    return (
        <div className={shape}>
            <label htmlFor={propsOBJ.id}>{propsOBJ.id}</label>
            <input
                type={propsOBJ.type}
                id={propsOBJ.id}
                placeholder={propsOBJ.placeholderText ? propsOBJ.placeholderText : 'placeholder'}
                value={propsOBJ.value}
                onChange={(event) => propsOBJ.onChangeX(event.target.value)}
            />
        </div>
    )
}