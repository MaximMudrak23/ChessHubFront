import s from './styles.module.scss'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import type { SelectedTab } from '../../index'
import { login, registerStart } from '@/api/authApi'

import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import SignUpWaitingEmail from './components/SignUpWaitingEmail'

type Props = { selectedTab: SelectedTab; }
type SignIn = { email: string; password: string }
type SignUp = { email: string; password: string; key: string }
type SignUpStep = 'form' | 'waiting-email';

export default function InputsFolder({selectedTab}: Props) {
    const [signIn,setSignIn] = useState<SignIn>({email: '', password: ''})
    const [signUp,setSignUp] = useState<SignUp>({email: '', password: '', key: ''})
    const [signUpStep, setSignUpStep] = useState<SignUpStep>('form');
    
    const setAuth = useUserStore(s => s.setAuth);
    const navigate = useNavigate();

    async function handleSignIn() {
        try {
            const data = await login(signIn.email, signIn.password);

            setAuth(data.user, data.token);
            localStorage.setItem('token', data.token);

            navigate('/main');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Login failed');
        }
    }

    async function handleSignUp() {
        try {
            const data = await registerStart(signUp.email, signUp.password, signUp.key);

            if ('token' in data && 'user' in data) {
                setAuth(data.user, data.token);
                localStorage.setItem('token', data.token);
                navigate('/main');
                return;
            }

            setSignUpStep('waiting-email');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Register failed');
        }
    }

    return (
        <div className={s.inputs_folder}>
            <AnimatePresence mode='wait'>
                {selectedTab === 'signin' && (
                    <SignInForm
                        signIn={signIn}
                        setSignIn={setSignIn}
                        onSubmit={handleSignIn}
                    />
                )}

                {selectedTab === 'signup' && signUpStep === 'form' && (
                    <SignUpForm
                        signUp={signUp}
                        setSignUp={setSignUp}
                        onSubmit={handleSignUp}
                    />
                )}

                {selectedTab === 'signup' && signUpStep === 'waiting-email' && (
                    <SignUpWaitingEmail
                        email={signUp.email}
                        onChangeEmail={() => setSignUpStep('form')}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}