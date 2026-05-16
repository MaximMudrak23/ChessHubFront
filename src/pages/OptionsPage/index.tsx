import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import OptionsScreen from '@/components/Modules/OptionsScreen';
import { SVG } from '@/constants/paths';

const OPTIONS_PAGE_OPTIONS = [
    {
        optionName: 'Game Process',
        title: 'Game Process',
        description: ['Change your nickname and description'],
        // Component: GeneralProfileEdit,
    },
];

export default function OptionsPage() {
    return (
        <SteamContentWrapper styleProps={{backgroundColor: 'transparent'}}>
            <div className={s.title}>
                <img src={SVG.gear} alt="Gear" draggable={false} />
                <h1>Options</h1>
            </div>

            <OptionsScreen options={OPTIONS_PAGE_OPTIONS} />
        </SteamContentWrapper>
    )
}