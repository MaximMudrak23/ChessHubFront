import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import OptionsScreen from '@/components/Modules/OptionsScreen';

import GeneralOption from './components/GeneralOption';
import AvatarOption from './components/AvatarOption';

import { SVG } from '@/constants/paths';

const PROFILE_EDIT_OPTIONS = [
    {
        optionName: 'General',
        title: 'About',
        description: [
            'Set your profile name and details here.',
            'Your name and avatar represent you throughout ChessHub. and must be appropriate for all audiences. Please be polite.',
        ],
        Component: GeneralOption,
    },
    {
        optionName: 'Avatar',
        title: 'About',
        description: [
            'Upload file from your device.',
            'Required square image at least 200x200 pixels.'
        ],
        Component: AvatarOption,
    },
    {
        optionName: 'Background',
        title: 'Background',
        description: ['Change your profile background'],
    },
    {
        optionName: 'Song',
        title: 'Song',
        description: ['Change your profile song'],
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