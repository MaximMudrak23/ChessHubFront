import s from './styles.module.scss'
import a from './animations.module.scss'

type Animation = 'main_animation' | 'notfound_animation';
type Shape = 'profile_shape' | 'game_shape' | 'main_shape' | 'notfound_shape';

type Props = 
    | {
        variant: 'txt';
        text: string;
        shape: Shape;
        animation?: Animation;
        onClick: () => void
    }
    | {
        variant: 'img';
        imgURL: string;
        shape: Shape;
        animation?: Animation;
        onClick: () => void
    }
    | {
        variant: 'txtimg';
        text: string;
        imgURL: string;
        shape: Shape;
        animation?: Animation;
        onClick: () => void
    }

export default function Button(propsOBJ: Props) {
    const def = s.button;
    const shape = s[propsOBJ.shape];
    const animation = propsOBJ.animation && a[propsOBJ.animation];
    const classes = [ def, shape, animation ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            onClick={propsOBJ.onClick}
        >
            {(propsOBJ.variant === 'txt' || propsOBJ.variant === 'txtimg') && <p>{propsOBJ.text}</p>}
            {(propsOBJ.variant === 'img' || propsOBJ.variant === 'txtimg') && <img src={propsOBJ.imgURL} alt="Game Icon" />}
        </button>
    )
}