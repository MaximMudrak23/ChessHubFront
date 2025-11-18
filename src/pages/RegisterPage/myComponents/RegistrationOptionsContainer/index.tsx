import s from './styles.module.scss'
import Option from '../../../../shared/Button'

type Props = {
    setActiveOption: (x: number) => void;
}

export default function RegistrationOptionsContainer({setActiveOption}: Props) {
    return (
        <section className={s.registration__options}>
            <Option text='Create Account' onClick={() => setActiveOption(1)} />
            <Option text='Log In' onClick={() => setActiveOption(2)} />
            {/* <Option text='Admin Pannel' onClick={() => setActiveOption(3)} /> */}
        </section>
    )
}