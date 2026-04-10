import s from './styles.module.scss'
import { useState } from 'react'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import OptionsContainer from '../../components/Modules/OptionsContainer'

const OPTIONS = [ {name: 'Users'}, {name: 'Keys'} ]
const BUTTONS = [ {name: 'Find'}, {name: 'Create'}, {name: 'Filter'} ]

export default function AdminPage() {
    const [selectedFolder, setSelectedFolder] = useState(0);
    const [inputValue, setInputValue] = useState('');

    return (
        <section className={s.admin_page}>
            <OptionsContainer
                OptionsArr={OPTIONS}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                styleProps={{backgroundColor: '#1A1817'}}
            />

            <div className={s.main}>
                <header className={s.header}>
                    <Input
                        id='search-button'
                        value={inputValue}
                        onChangeHandler={setInputValue}
                        variant='grey'
                        placeholderText='Search...'
                        styleProps={{flex: '1'}}
                    />
                    {BUTTONS.map(obj => (
                        <Button
                            text={obj.name}
                            variant='black'
                            animation='game'
                            onClick={()=>''}
                            styleProps={{
                                width:'200px',
                                borderRadius: '5px'
                            }}
                        />))
                    }
                </header>
                <div className={s.cards_container}>

                </div>
            </div>
        </section>
    )
}