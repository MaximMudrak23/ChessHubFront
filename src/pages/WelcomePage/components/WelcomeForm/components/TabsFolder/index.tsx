import s from './styles.module.scss'
import type { SelectedTab } from '../../index'

type Props = {
    tab: SelectedTab;
    changeTab: (x: SelectedTab) => void;
}

export default function TabsFolder({tab, changeTab}: Props) {
    return (
        <div role='tablist' className={s.tabs_folder}>
            <button
                role='tab'
                aria-selected={tab === 'signin'}
                onClick={()=>changeTab('signin')}
            >Sign In</button>
            <button
                role='tab'
                aria-selected={tab === 'signup'}
                onClick={()=>changeTab('signup')}
            >Sign Up</button>
        </div>
    )
}