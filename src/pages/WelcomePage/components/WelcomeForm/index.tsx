import { useState } from 'react'
import s from './styles.module.scss'
import LogoFolder from './components/LogoFolder';
import TabsFolder from './components/TabsFolder';
import InputsFolder from './components/InputsFolder';

export type SelectedTab = 'signin' | 'signup';

export default function WelcomeForm() {
    const [selectedTab, setSelectedTab] = useState<SelectedTab>('signin');
    return (
        <section className={s.welcome_form}>
            <LogoFolder />
            <TabsFolder tab={selectedTab} changeTab={setSelectedTab} />
            <InputsFolder selectedTab={selectedTab} />
        </section>
    )
}