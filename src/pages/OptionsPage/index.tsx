import s from './styles.module.scss'
import { useState } from 'react'
import SteamContentWrapper from '../../components/SteamContentWrapper'
import EventScreen from './components/EventScreen';
import OptionsContainer from '../../components/Modules/OptionsContainer';

const OPTIONS = [
    {name: 'Board & Figures'},
    {name: 'Game Process'},
    {name: 'Profile'},
    {name: 'Account'},
    {name: 'Languages'},
    {name: 'Labs', imgURL:'/all/labs.svg'},
];

export default function OptionsPage() {
    const [selectedFolder,setSelectedFolder] = useState(0);
    
    return (
        <SteamContentWrapper styleProps={{backgroundColor: 'transparent'}}>
            <div className={s.title}>
                <img src="/all/gear.svg" alt="Gear" draggable={false} />
                <h1>Options</h1>
            </div>

            <div className={s.content}>
                <OptionsContainer OptionsArr={OPTIONS} selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />
                <EventScreen selectedFolder={selectedFolder} />
            </div>
        </SteamContentWrapper>
    )
}