import s from './styles.module.scss'
import SteamContentWrapper from '@/components/SteamContentWrapper'
import OptionsScreen from '@/components/Modules/OptionsScreen'

import UserOption from './components/Options/UserOption'
import KeysOption from './components/Options/KeysOption'

import { SVG } from '@/constants/paths'

const ADMIN_OPTIONS = [
    {
        optionName: 'Users',
        Component: UserOption,
    },
    {
        optionName: 'Bots',
        // Component: GeneralOption,
    },
    {
        optionName: 'Keys',
        Component: KeysOption,
    },
]

export default function AdminPage() {
    return (
        <SteamContentWrapper styleProps={{backgroundColor: 'transparent'}}>
            <div className={s.title}>
                <img src={SVG.gear} alt="Gear" draggable={false} />
                <h1>Admin</h1>
            </div>

            <OptionsScreen options={ADMIN_OPTIONS} />
        </SteamContentWrapper>
    )
}