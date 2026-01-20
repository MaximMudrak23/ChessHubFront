import s from './styles.module.scss'
import a from './animations.module.scss'

// Позже сделать анимации получше, типо названия дать им нормальтные и сделать много дефолтных анимаций ну типо затухание, плавное переключение, вверх и вниз как на нотфаунде и все такое. ну и мб цвета отдельно добавить хз

type Animation = 'main_animation' | 'notfound_animation' | 'game_animation';
type Shape = 'profile_shape' | 'game_shape' | 'main_shape' | 'notfound_shape' | 'tab_shape';

type Props = 
    | {
        variant: 'txt';
        text: string;
        shape: Shape;
        animation?: Animation;
        active?: boolean;
        onClick: () => void;
    }
    | {
        variant: 'img';
        imgURL: string;
        shape: Shape;
        animation?: Animation;
        active?: boolean;
        onClick: () => void;
    }
    | {
        variant: 'txtimg';
        text: string;
        imgURL: string;
        shape: Shape;
        animation?: Animation;
        active?: boolean;
        onClick: () => void;
    }

export default function Button(propsOBJ: Props) {
    const def = s.button;
    const shape = s[propsOBJ.shape];
    const animation = propsOBJ.animation && a[propsOBJ.animation];
    const active = propsOBJ.active ? s.active : undefined;
    const classes = [ def, shape, animation, active ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            onClick={propsOBJ.onClick}
        >
            {(propsOBJ.variant === 'txt' || propsOBJ.variant === 'txtimg') && <p>{propsOBJ.text}</p>}
            {(propsOBJ.variant === 'img' || propsOBJ.variant === 'txtimg') && <img src={propsOBJ.imgURL} alt="Game Icon" draggable='false' />}
        </button>
    )
}