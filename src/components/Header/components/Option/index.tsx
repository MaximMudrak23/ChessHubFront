import s from './styles.module.scss'

type Props = {
    img: string;
    text?: string;
    variation: 'header' | 'aside';
}

export default function Option({img, text, variation}: Props) {
    const classVariation = variation === 'header' ? s.option_header : s.option_aside;
    return (
       <div className={`${s.option_wrapper} ${classVariation}`}>
            {variation === 'header' && 
                <>
                    <img
                        style={{width: '36px', height: '36px'}}
                        src={img}
                        alt="Header Option"
                        draggable={false}
                    />
                    {text && <p>{text}</p>}
                </>
            }
            {variation === 'aside' && 
                <>
                    <img
                        style={{width: '36px', height: '36px'}}
                        src={img}
                        alt="Aside Option"
                        draggable={false}
                    />
                    {text && <p>{text}</p>}
                </>
            }
        </div>
    )
}