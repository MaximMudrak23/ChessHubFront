import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import { motion } from 'framer-motion'

type SignUp = { email: string; password: string; key: string }

type Props = {
    signUp: SignUp;
    setSignUp: React.Dispatch<React.SetStateAction<SignUp>>;
    onSubmit: () => void;
}

export default function SignUpForm({ signUp, setSignUp, onSubmit }: Props) {
    const isActive = !Object.values(signUp).some(v => v.trim() === '');

    return (
        <motion.div
            key='signup-form'
            className={s.sign_up_form}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Input
                id='signup-login'
                value={signUp.email}
                onChangeHandler={v => setSignUp(x => ({ ...x, email: v }))}
                variant='grey'
                animation='fluid-gradient'
                placeholderText='Email'
                styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
            />

            <Input
                id='signup-password'
                value={signUp.password}
                onChangeHandler={v => setSignUp(x => ({ ...x, password: v }))}
                variant='grey'
                animation='fluid-gradient'
                placeholderText='Password'
                isHidden
                styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
            />

            <Input
                id='signup-key'
                value={signUp.key}
                onChangeHandler={v => setSignUp(x => ({ ...x, key: v }))}
                variant='grey'
                animation='fluid-gradient'
                placeholderText='Key'
                styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
            />

            <Button
                text='REGISTER'
                variant='welcome'
                animation='mini-jump'
                active={isActive}
                styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                onClick={onSubmit}
            />
        </motion.div>
    )
}