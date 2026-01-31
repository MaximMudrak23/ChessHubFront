import s from './styles.module.scss'
import Switch from './components/Switch'
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'

export default function RightSide() {
    const [selectedOption, setSelectedOption] = useState<'signin' | 'signup'>('signin');
    const [signInData,setSignInData] = useState({ stage: 1 as 1 | 2, login: '', password: '', key: '', username: '', email: '' });
    const [signUpData,setSignUpData] = useState({ login: '', password: '' });

    return (
        <section className={s.right_side}>
            <Switch selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <div className={s.content}>    
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedOption}
                        className={s.motion}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.25}}
                        style={{ willChange: 'opacity' }}
                    >
                        {selectedOption === 'signin' ? <SignIn data={signInData} setData={setSignInData} /> : <SignUp data={signUpData} setData={setSignUpData} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}