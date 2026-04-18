import s from './styles.module.scss'
import Option from '../../UI/Option';

type OptionItem = {
    name: string;
    imgURL?: string;
}

type Props = {
    options: OptionItem[];
    activeIndex: number;
    onSelect: (index: number) => void;
    styleProps?: React.CSSProperties;
}

export default function OptionsContainer(props: Props) {
    return (
        <div className={s.options_container} style={props.styleProps}>
            {
                props.options.map((option, index) => (
                    <Option
                        key={option.name}
                        name={option.name}
                        imgURL={option.imgURL}
                        isActive={props.activeIndex === index}
                        isGlow
                        fontSize={'high'}
                        lineAxis={'vertical'}
                        onClick={()=>props.onSelect(index)}
                    />
                ))
            }
        </div>
    )
}