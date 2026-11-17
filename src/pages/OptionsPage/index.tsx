import s from './styles.module.scss'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import OptionsScreen from '@/components/Modules/OptionsScreen';
import { SVG } from '@/constants/paths';
import BoardAndFiguresOption from './components/BoardAndFiguresOption';

const OPTIONS_PAGE_OPTIONS = [
    {
        optionName: 'Board & Figures',
        title: 'Board & Figures',
        description: ['Settings for making your gameplay looks more better'],
        Component: BoardAndFiguresOption,
    },
    {
        optionName: 'Gameplay',
        title: 'Gameplay',
        description: ['Settings for making your gameplay more comfortable'],
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
