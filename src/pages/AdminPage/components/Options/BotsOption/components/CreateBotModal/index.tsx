import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import { useState } from 'react'

type BotType = 'stockfish' | 'mirror' | 'personality'

type Props = {
    onClose: () => void;
    onCreate: (data: {
        botType: BotType;
        name: string;
        skillLevel: number;
    }) => void;
}

export default function CreateBotModal({ onClose, onCreate }: Props) {
    const [botType, setBotType] = useState<BotType>('stockfish');
    const [botName, setBotName] = useState('');
    const [skillLevel, setSkillLevel] = useState('5');

    const skillOptions = Array.from({ length: 21 }, (_, i) => i);

    const handleCreate = () => {
        onCreate({
            botType,
            name: botName,
            skillLevel: Number(skillLevel),
        });

        onClose();
    }

    return (
        <div className={s.create_bot_modal_background} onClick={onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                <div className={s.tabs}>
                    <Button
                        text="Stockfish"
                        variant="profile"
                        animation="white-hover"
                        onClick={() => setBotType('stockfish')}
                        className={`${s.button} ${botType === 'stockfish' ? s.active_button : ''}`}
                    />

                    <Button
                        text="Mirror"
                        variant="profile"
                        animation="white-hover"
                        active={false}
                        onClick={() => {}}
                        className={s.button}
                    />

                    <Button
                        text="Personality"
                        variant="profile"
                        animation="white-hover"
                        active={false}
                        onClick={() => {}}
                        className={s.button}
                    />
                </div>

                <div className={s.fields}>
                    <Input
                        id="bot-name-input"
                        name="botName"
                        value={botName}
                        onChangeHandler={setBotName}
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
                        text="Save"
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