import s from './styles.module.scss'
import Input from '../../../../../../components/UI/Input'
import Button from '../../../../../../components/UI/Button'
import type { SelectedTab } from '../../index'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

type Props = { selectedTab: SelectedTab; }
type SignIn = {login: string; password: string}
type SignUp = {login: string; password: string; mail: string; key: string;}

export default function InputsFolder({selectedTab}: Props) {
    const [signIn,setSignIn] = useState<SignIn>({login: '', password: ''})
    const [signUp,setSignUp] = useState<SignUp>({login: '', password: '', mail: '', key: ''})
    const signInButton = !Object.values(signIn).some(v => v.trim() === '');
    const signUpButton = !Object.values(signUp).some(v => v.trim() === '');

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
                            value={signIn.login}
                            onChangeHandler={v => setSignIn(x => ({...x, login: v}))}
                            variant='fluid-gradient'
                            placeholderText='Login'
                            styleProps={{ width: '75%', height: '64px' }}
                        />
                        <Input
                            value={signIn.password}
                            onChangeHandler={v => setSignIn(x => ({...x, password: v}))}
                            variant='fluid-gradient'
                            placeholderText='Password'
                            isHidden
                            styleProps={{ width: '75%', height: '64px' }}
                        />
                        <Button
                            text='WELCOME BACK'
                            variant='welcome'
                            animation='mini-jump'
                            active={signInButton}
                            styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                            onClick={()=>''}
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
                            value={signUp.login}
                            onChangeHandler={v => setSignUp(x => ({...x, login: v}))}
                            variant='fluid-gradient'
                            placeholderText='Login'
                            styleProps={{ width: '75%', height: '64px' }}
                        />
                        <Input
                            value={signUp.password}
                            onChangeHandler={v => setSignUp(x => ({...x, password: v}))}
                            variant='fluid-gradient'
                            placeholderText='Password'
                            isHidden
                            styleProps={{ width: '75%', height: '64px' }}
                        />
                        <Input
                            value={signUp.mail}
                            onChangeHandler={v => setSignUp(x => ({...x, mail: v}))}
                            variant='fluid-gradient'
                            placeholderText='Mail'
                            styleProps={{ width: '75%', height: '64px' }}
                        />
                        <Input
                            value={signUp.key}
                            onChangeHandler={v => setSignUp(x => ({...x, key: v}))}
                            variant='fluid-gradient'
                            placeholderText='Key'
                            styleProps={{ width: '75%', height: '64px' }}
                        />
                        <Button
                            text='REGISTER'
                            variant='welcome'
                            animation='mini-jump'
                            active={signUpButton}
                            styleProps={{ width: '75%', height: '64px', borderRadius: '10px' }}
                            onClick={()=>''}
                        />
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}