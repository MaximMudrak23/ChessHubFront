import s from './styles.module.scss'
import Option from '../Option';
import OptionsContainer from '../OptionsContainer';
import CloseIcon from '../CloseIcon';
import { useHeaderOptions } from '../../hooks/useHeaderOptions';

type Props = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Aside(props: Props) {
    const options = useHeaderOptions();

    return (
        <>
            <div className={`${s.aside_background} ${props.isOpen ? s.bc_open : ''}`} onClick={()=>props.setIsOpen(x => !x)} />
            
            <aside
                className={`${s.aside} ${props.isOpen ? s.open : ''}`}
                inert={!props.isOpen ? true : undefined}
            >
                <OptionsContainer className={s.aside_options_container}>
                    <div className={s.close_icon}>
                        <CloseIcon
                            onClick={() => props.setIsOpen(x => !x)}
                        />
                    </div>
                    {options.map(o => (
                        <Option
                            key={o.text}
                            img={o.img}
                            text={o.text}
                            variation='aside'
                            onClick={o.onClick}
                        />
                    ))}
                </OptionsContainer>
            </aside>
        </>
    )
}