import { useState } from 'react'
import s from './styles.module.scss'
import LogoFolder from './components/LogoFolder';
import TabsFolder from './components/TabsFolder';
import InputsFolder from './components/InputsFolder';

export type SelectedTab = 'signin' | 'signup';
// type SignUp = { login: string; password: string; email: string; key: string; };
// type SignIn = { login: string; password: string; };

export default function WelcomeForm() {
    const [selectedTab, setSelectedTab] = useState<SelectedTab>('signin');
    // const [signUp, setSignUp] = useState<SignUp>({login: '', password: '', email: '', key: ''});
    // const [signIn, setSignIn] = useState<SignIn>({login: '', password: ''});
    return (
        <section className={s.welcome_form}>
            <LogoFolder />
            <TabsFolder tab={selectedTab} changeTab={setSelectedTab} />
            <InputsFolder />
        </section>
    )
}