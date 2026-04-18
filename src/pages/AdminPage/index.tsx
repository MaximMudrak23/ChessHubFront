import s from './styles.module.scss'
import OptionsContainer from '../../components/Modules/OptionsContainer'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import Card from './components/Card'
import { useState } from 'react'

const folders = [
    {
        folderName: 'Users',
        placeholderText: 'Find user...',
        buttons: [
            { text: 'Find', onClick: () => {} },
            { text: 'Create', onClick: () => {} },
        ]
    },
    {
        folderName: 'Keys',
        placeholderText: 'Find key...',
        buttons: [
            { text: 'Find', onClick: () => {} },
            { text: 'Create', onClick: () => {} },
        ]
    }
];

export default function AdminPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');

    return (
        <section className={s.page}>
            <OptionsContainer
                options={folders.map(folder => ({name: folder.folderName}))}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                styleProps={{ backgroundColor: '#1A1817' }}
            />

            <div className={s.content_area}>
                <header className={s.header}>
                    <Input
                        value={inputValue}
                        onChangeHandler={setInputValue}
                        id={'admin-input'}
                        variant={'grey'}
                        placeholderText={folders[activeIndex].placeholderText}
                        className={s.input}
                    />
                    
                    <div className={s.buttons}>
                        {folders[activeIndex].buttons.map(btn => (
                            <Button
                                key={btn.text}
                                text={btn.text}
                                variant='green'
                                onClick={btn.onClick}
                                className={s.button}
                            />
                        ))}
                    </div>
                </header>

                <div className={s.cards}>
                    <Card
                        imgURL={'/all/i1.png'}
                        frameURL={'/steam/steam2.png'}
                        username={'Recront'}
                        regDate={'17/04/2026'}
                        id={1}
                        login={'zxcloginasd'}
                        mail={'zxcasdmail@gmail.com'}
                        role={'User'}
                        lastSeen={'Online'}
                        isBanned={false} 
                    />
                </div>
            </div>
        </section>
    )
}