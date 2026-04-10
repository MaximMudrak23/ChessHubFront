import s from './styles.module.scss'
import Option from '../../UI/Option';

type Options = {
    name: string;
    imgURL?: string;
}

type Props = {
    OptionsArr: Options[];
    selectedFolder: number;
    setSelectedFolder: React.Dispatch<React.SetStateAction<number>>;
    styleProps?: React.CSSProperties;
}

export default function OptionsContainer({OptionsArr, selectedFolder, setSelectedFolder, styleProps}: Props) {
    return (
        <section className={s.options_container} style={styleProps}>
            {
                OptionsArr.map((option, index) => (
                    <Option
                        key={option.name}
                        name={option.name}
                        imgURL={option.imgURL}
                        isActive={selectedFolder === index}
                        isGlow
                        fontSize={'high'}
                        lineAxis={'vertical'}
                        onClick={()=>setSelectedFolder(index)}
                    />
                ))
            }
        </section>
    )
}