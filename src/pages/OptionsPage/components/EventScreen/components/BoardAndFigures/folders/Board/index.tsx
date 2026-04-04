import s from './styles.module.scss'
import VariationsContainer from '../../components/VariationsContainer';
import VariationsShowcase from '../../components/VariationsShowcase';
import SettingRow from '../../../../../../../../components/Modules/SettingRow';
import RadioButton from '../../../../../../../../components/UI/RadioButton';
import { useState } from 'react';
import Button from '../../../../../../../../components/UI/Button';

const BoardVariations = {
    'Default': { view: '/Board Variations/board1.png' },
    'Ocean Blue': { view: '/Board Variations/board2.png' },
    'White Lotus': { view: '/Board Variations/board1.png' },
    'UMBRA': { view: '/Board Variations/board2.png' },
    'Very Long Name': { view: '/Board Variations/board1.png' },
    'Default123': { view: '/Board Variations/board1.png' },
    'Ocea123n Blue': { view: '/Board Variations/board2.png' },
    'Whiфывte Lotus': { view: '/Board Variations/board1.png' },
    'UMчсмBRA': { view: '/Board Variations/board2.png' },
    'Verфыв Long Name': { view: '/Board Variations/board1.png' },
    'Defaавпult': { view: '/Board Variations/board1.png' },
    'Oceсчмиan Blue': { view: '/Board Variations/board2.png' },
    'Whiфывtрпаe Lotus': { view: '/Board Variations/board1.png' },
    'UMчсавпмBRA': { view: '/Board Variations/board2.png' },
    'Veryфывфыв Long Name': { view: '/Board Variations/board1.png' },
} as const;

export type BoardVariationsKey = keyof typeof BoardVariations;
export type BoardVariationsMap = typeof BoardVariations;

export default function Board() {
    const [selectedVariant, setSelectedVariant] = useState<BoardVariationsKey>('Default');
    const [toggle, setToggle] = useState({
        firstToggle: false,
        secondToggle: false,
    }); // вместо этого потом мб глобал стейт
    const [selectedRadio, setSelectedRadio] = useState<string>('Inside');
    
    return (
        <section className={s.board_folder}>
            {/* <div className={s.preview_container}>
                <VariationsContainer
                    BoardVariations={BoardVariations}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                />
                <VariationsShowcase whiteCell='/all/whiteCell.png' blackCell='/all/blackCell.png' />
            </div>
            <div className={s.buttons_container}>
            <Button
                text='Decline'
                variant='black'
                animation='game'
                active={false} // selectedVariant !== globalstate...
                styleProps={{
                    width: '16vw',
                    height: '5vw',
                    maxWidth: '200px',
                    maxHeight: '60px',
                    minWidth: '165px',
                    minHeight: '48px',
                    borderRadius: '5px',
                }}
                onClick={()=>''} // setSelectedVariant to globalstate...
            />
            <Button
                text='Save'
                variant='green'
                animation='game'
                active={false} // selectedVariant !== globalstate...
                styleProps={{
                    width: '16vw',
                    height: '5vw',
                    maxWidth: '200px',
                    maxHeight: '60px',
                    minWidth: '165px',
                    minHeight: '48px',
                    borderRadius: '5px',
                }}
                onClick={()=>''} // update globalstate...
            />
        </div>
            <SettingRow
                title={'Show board coordinates'}
                toggleIsChecked={toggle.firstToggle}
                toggleOnChangeHandler={toggleCurState => setToggle(prev => ({...prev, firstToggle: toggleCurState}))}
                children={
                    <div className={s.setting_row}>
                        <RadioButton
                            radioName={'Inside'}
                            value={'Inside'}
                            group={'board_coords'}
                            checked={selectedRadio === 'Inside'}
                            isActive={toggle.firstToggle}
                            onChangeHandler={setSelectedRadio}
                        />
                        <RadioButton
                            radioName={'Outside'}
                            value={'Outside'}
                            group={'board_coords'}
                            checked={selectedRadio === 'Outside'}
                            isActive={toggle.firstToggle}
                            onChangeHandler={setSelectedRadio}
                        />
                    </div>
                }
            />
            <SettingRow
                title={'Show possible moves'}
                toggleIsChecked={toggle.secondToggle}
                toggleOnChangeHandler={toggleCurState => setToggle(prev => ({...prev, secondToggle: toggleCurState}))}
                children={<p className={s.setting_row}>Create miniboard component and use here and in BoardShowcase</p>}
            /> */}
        </section>
    )
}