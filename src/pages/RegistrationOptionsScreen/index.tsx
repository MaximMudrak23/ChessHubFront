import s from './styles.module.scss'
import Index0 from '../OptionsBehaviors/index0'
import Index1 from '../OptionsBehaviors/index1'
import Index2 from '../OptionsBehaviors/index2'
import Index3 from '../OptionsBehaviors/index3'

type Props = {
    activeOption: number;
}

export default function RegistrationOptionsScreen({activeOption}: Props) {
    return (
        <section className={s.registration__options__screen}>
            {activeOption === 0 && <Index0 />}
            {activeOption === 1 && <Index1 />}
            {activeOption === 2 && <Index2 />}
            {activeOption === 3 && <Index3 />}
        </section>
    )
}