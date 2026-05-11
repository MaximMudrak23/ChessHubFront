import s from './styles.module.scss'

type Props = {
    img: string;
    text?: string;
    variation: 'header' | 'aside';
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Option(props: Props) {
    const classVariation = props.variation === 'header' ? s.option_header : s.option_aside;
    return (
       <button className={`${s.option_wrapper} ${classVariation}`} onClick={props.onClick}>
            {props.variation === 'header' && 
                <>
                    <img
                        style={{width: '36px', height: '36px'}}
                        src={props.img}
                        alt="Header Option"
                        draggable={false}
                    />
                    {props.text && <p>{props.text}</p>}
                </>
            }
            {props.variation === 'aside' && 
                <>
                    <img
                        style={{width: '36px', height: '36px'}}
                        src={props.img}
                        alt="Aside Option"
                        draggable={false}
                    />
                    {props.text && <p>{props.text}</p>}
                </>
            }
        </button>
    )
}