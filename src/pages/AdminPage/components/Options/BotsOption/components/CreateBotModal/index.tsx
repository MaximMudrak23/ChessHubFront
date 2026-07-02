import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import { useState } from 'react'
import { ENGINE_CONFIG, type EngineType } from '@/constants/engineConfig'

type Props = {
    onClose: () => void;
    onCreate: (data: {
        name: string;
        engine: EngineType;
        skillLevel: number;
    }) => void;
}

export default function CreateBotModal({ onClose, onCreate }: Props) {
    const [engine, setEngine] = useState<EngineType>('stockfish');
    const [botName, setName] = useState('');
    const [skillLevel, setSkillLevel] = useState('5');

    const config = ENGINE_CONFIG[engine];
    
    const skillOptions = Array.from(
        { length: config.maxSkill - config.minSkill + 1 },
        (_, i) => config.minSkill + i
    );

    const handleEngineChange = (nextEngine: EngineType) => {
        setEngine(nextEngine);
        setSkillLevel(String(ENGINE_CONFIG[nextEngine].defaultSkill));
    };

    const handleCreate = () => {
        onCreate({
            engine,
            name: botName,
            skillLevel: Number(skillLevel),
        });

        onClose();
    }

    return (
        <div className={s.create_bot_modal_background} onClick={onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                <div className={s.tabs}>
                    {(Object.keys(ENGINE_CONFIG) as EngineType[]).map(item => (
                        <Button
                            key={item}
                            text={ENGINE_CONFIG[item].title}
                            variant="profile"
                            animation="white-hover"
                            onClick={() => handleEngineChange(item)}
                            className={`${s.button} ${engine === item ? s.active_button : ''}`}
                        />
                    ))}
                </div>

                <div className={s.fields}>
                    <Input
                        id="bot-name-input"
                        name="botName"
                        value={botName}
                        onChangeHandler={setName}
                        variant="profile"
                        placeholderText="Name"
                        styleProps={{
                            width: '100%',
                            height: '75px',
                        }}
                    />

                    <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className={s.select}
                    >
                        {skillOptions.map(level => (
                            <option key={level} value={level}>
                                Skill Level {level}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={s.buttons_container}>
                    <Button
                        text="Create"
                        variant="profile"
                        animation="white-hover"
                        onClick={handleCreate}
                        styleProps={{ flex: '1' }}
                    />

                    <Button
                        text="Cancel"
                        variant="profile"
                        animation="white-hover"
                        onClick={onClose}
                        styleProps={{ flex: '1' }}
                    />
                </div>
            </div>
        </div>
    )
}