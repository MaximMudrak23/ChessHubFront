import s from './styles.module.scss'

type Props = {
    selectedOption: 'signin' | 'signup';
    setSelectedOption: (x: 'signin' | 'signup') => void;
}

export default function Switch({selectedOption, setSelectedOption}: Props) {
    return (
        <div className={s.switch}>
            <button className={selectedOption === 'signin' ? s.selected : ''} onClick={()=>setSelectedOption('signin')}>Sign In</button>
            <button className={selectedOption === 'signup' ? s.selected : ''} onClick={()=>setSelectedOption('signup')}>Sign Up</button>
        </div>
    )
}