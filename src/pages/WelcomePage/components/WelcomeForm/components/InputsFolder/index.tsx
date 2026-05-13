import s from './styles.module.scss'
import Input from '../../../../../../components/UI/Input'
import Button from '../../../../../../components/UI/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import type { SelectedTab } from '../../index'
import { login, register } from '@/api/authApi'

type Props = { selectedTab: SelectedTab; }
type SignIn = {email: string; password: string}
type SignUp = {email: string; password: string; key: string;}

export default function InputsFolder({selectedTab}: Props) {
    const [signIn,setSignIn] = useState<SignIn>({email: '', password: ''})
    const [signUp,setSignUp] = useState<SignUp>({email: '', password: '', key: ''})
    const signInButton = !Object.values(signIn).some(v => v.trim() === '');
    const signUpButton = !Object.values(signUp).some(v => v.trim() === '');
    
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
            const data = await register(signUp.email, signUp.password, signUp.key);

            setAuth(data.user, data.token);
            localStorage.setItem('token', data.token);

            navigate('/main');
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Register failed');
        }
    }

    return (
        <div className={s.inputs_folder}>
            <AnimatePresence mode='wait'>
                {selectedTab === 'signin' &&
                    <motion.div
                        key={'signin'}
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <Input
                            id='signin-login'
                            variant='grey'
                            animation='fluid-gradient'
                            placeholderText='Email'
                            value={signIn.email}
                            onChangeHandler={v => setSignIn(x => ({...x, email: v}))}
                            styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
                        />
                        <Input
                            id='signin-password'
                            value={signIn.password}
                            onChangeHandler={v => setSignIn(x => ({...x, password: v}))}
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
                            active={signInButton}
                            styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                            onClick={handleSignIn}
                        />
                    </motion.div>
                }

                {selectedTab === 'signup' &&
                    <motion.div
                        key={'signup'}
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <Input
                            id='signup-login'
                            value={signUp.email}
                            onChangeHandler={v => setSignUp(x => ({...x, email: v}))}
                            variant='grey'
                            animation='fluid-gradient'
                            placeholderText='Email'
                            styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
                        />
                        <Input
                            id='signup-password'
                            value={signUp.password}
                            onChangeHandler={v => setSignUp(x => ({...x, password: v}))}
                            variant='grey'
                            animation='fluid-gradient'
                            placeholderText='Password'
                            isHidden
                            styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
                        />
                        <Input
                            id='signup-key'
                            value={signUp.key}
                            onChangeHandler={v => setSignUp(x => ({...x, key: v}))}
                            variant='grey'
                            animation='fluid-gradient'
                            placeholderText='Key'
                            styleProps={{ width: '75%', height: '64px', borderRadius: '5px 5px 0 0' }}
                        />
                        <Button
                            text='REGISTER'
                            variant='welcome'
                            animation='mini-jump'
                            active={signUpButton}
                            styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                            onClick={handleSignUp}
                        />
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}