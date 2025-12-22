import type { CSSProperties } from 'react';
import s from './styles.module.scss'

// Почистить кнопку, страхнуть все ненужное и оставить только самое важное типо размеров, либо вообще все убрать и оставить чисто text, img, imgsize, styles

// ❌ UI-кнопка напряму лізе в zustand
// Button — це базовий UI-компонент.
// Зараз він:
// знає про useSearchStore
// знає про бізнес-логіку “пошук гри”
// Це погано масштабиться

// а еще при переходе на новую страницу я не могу из хедера убрать файндгейм + переделать файндгейм стиль и сделать лаконичнее + бордеры мб 9999 пикселей

// Есть идея просто создать новую кнопку и плавно перейти на нее!!!!

// Кнопка должна при 600 быть по центру я считаю

type Props = {
    text?: string;
    img?: string;
    imgSize?: string;
    width?: string;
    height?: string;
    background?: string;
    border?: string;
    radius?: number;
    fontSize?: string;
    isBold?: boolean;
    position?: CSSProperties['position'];
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    minWidth?: string;
    customClass?: string;
    animations?: boolean;
    color?: string;
    styles?: React.CSSProperties;
    isSearchButton?: boolean;
    onClick: () => void;
}

export default function Button({
    text,
    img,
    imgSize='1.65rem',
    width='auto',
    height='auto',
    background,
    border='0',
    radius,
    fontSize='1.25rem',
    isBold=false,
    position,
    top,
    left,
    right,
    bottom,
    minWidth,
    customClass,
    animations=true,
    color='white',
    styles,
    isSearchButton=false,
    onClick,
}: Props) {
    const classes = [s.button,customClass,animations && s.animationClass,].filter(Boolean).join(' ');

    return <button
        type='button'
        className={classes}
        style={{
            width: width,
            height: height,
            background: background,
            border: border,
            borderRadius: `${radius}px`,
            fontSize: fontSize,
            fontWeight: isBold ? 'bold' : 500,
            position: position,
            top: top,
            left: left,
            right: right,
            bottom: bottom,
            minWidth: minWidth,
            color: color,
            ...styles,
        }}
        onClick={onClick}
    >
        {img && <img src={img} style={{width: imgSize, height: imgSize}} alt={'Button icon'} />}
        {text && <span>{text}</span>}
        {/* {isSearchButton && <div className={s.cancel_searching}>
            <p>Cancel Searching</p>
        </div>} */}
    </button>
}