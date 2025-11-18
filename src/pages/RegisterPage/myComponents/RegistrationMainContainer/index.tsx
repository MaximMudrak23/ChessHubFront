import s from './styles.module.scss'
import Options from '../RegistrationOptionsContainer'
import Screen from '../RegistrationOptionsScreen'
import { useState } from 'react'

export default function RegistrationMainContainer() {
    const [activeOption,setActiveOption] = useState(0);
    return (
        <section className={s.registration__div}>
            <Options setActiveOption={setActiveOption} />
            <Screen activeOption={activeOption} />
        </section>
    )
}