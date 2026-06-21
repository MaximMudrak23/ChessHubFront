import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import { motion } from 'framer-motion'

type SignIn = { email: string; password: string }

type Props = {
    signIn: SignIn;
    setSignIn: React.Dispatch<React.SetStateAction<SignIn>>;
    onSubmit: () => void;
}

export default function SignInForm({ signIn, setSignIn, onSubmit }: Props) {
    const isActive = !Object.values(signIn).some(v => v.trim() === '');

    return (
        <motion.div
            key='signin'
            className={s.sign_in_form}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Input
                id='signin-login'
                variant='grey'
                animation='fluid-gradient'
                placeholderText='Email'
                value={signIn.email}
                onChangeHandler={v => setSignIn(x => ({ ...x, email: v }))}
                styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
            />

            <Input
                id='signin-password'
                value={signIn.password}
                onChangeHandler={v => setSignIn(x => ({ ...x, password: v }))}
                variant='grey'
                animation='fluid-gradient'
                placeholderText='Password'
                isHidden
                styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
            />

            <Button
                text='WELCOME BACK'
                variant='welcome'
                animation='mini-jump'
                active={isActive}
                styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                onClick={onSubmit}
            />
        </motion.div>
    )
}