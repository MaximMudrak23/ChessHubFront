import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import OptionsScreen from '@/components/Modules/OptionsScreen';
import { SVG } from '@/constants/paths';

const PROFILE_EDIT_OPTIONS = [
    {
        optionName: 'General',
        title: 'General',
        description: 'Change your nickname and description',
        // Component: GeneralProfileEdit,
    },
    {
        optionName: 'Avatar',
        title: 'Avatar',
        description: 'Change your avatar and frame',
    },
    {
        optionName: 'Background',
        title: 'Background',
        description: 'Change your profile background',
    },
    {
        optionName: 'Song',
        title: 'Song',
        description: 'Change your profile song',
    },
];

export default function ProfileEdit() {
    return (
        <SteamContentWrapper styleProps={{backgroundColor: 'transparent'}}>
            <div className={s.title}>
                <img src={SVG.gear} alt="Gear" draggable={false} />
                <h1>Edit Profile</h1>
            </div>

            <OptionsScreen options={PROFILE_EDIT_OPTIONS} />
        </SteamContentWrapper>
    )
}