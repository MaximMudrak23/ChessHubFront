import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import UserAvatar from '@/components/User/UserAvatar'
import { useEffect, useState } from 'react'
import { ENGINE_CONFIG, type EngineType } from '@/constants/engineConfig'
import type { AdminBot, CreateBotData } from '@/api/adminApi'

type Props = {
    onClose: () => void;
    onSave: (data: CreateBotData) => Promise<void>;
    bot?: AdminBot;
}

export default function CreateBotModal({ onClose, onSave, bot }: Props) {
    const [engine, setEngine] = useState<EngineType>(bot?.engine ?? 'stockfish');
    const [botName, setName] = useState(bot?.name ?? '');
    const [skillLevel, setSkillLevel] = useState(String(bot?.skillLevel ?? 5));
    const [avatarFile, setAvatarFile] = useState<File>();
    const [previewAvatarURL, setPreviewAvatarURL] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        return () => {
            if (previewAvatarURL) URL.revokeObjectURL(previewAvatarURL);
        };
    }, [previewAvatarURL]);

    const config = ENGINE_CONFIG[engine];
    const name = botName.trim();
    const canSave = name.length >= 1 && name.length <= 24 &&
        (!bot || name !== bot.name || !!avatarFile);
    
    const skillOptions = Array.from(
        { length: config.maxSkill - config.minSkill + 1 },
        (_, i) => config.minSkill + i
    );

    const handleEngineChange = (nextEngine: EngineType) => {
        setEngine(nextEngine);
        setSkillLevel(String(ENGINE_CONFIG[nextEngine].defaultSkill));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            alert('Choose a JPEG, PNG, WebP or GIF image up to 5 MB');
            e.target.value = '';
            return;
        }

        setAvatarFile(file);
        setPreviewAvatarURL(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (isSaving || !canSave) return;

        setIsSaving(true);
        try {
            await onSave({
                engine,
                name,
                skillLevel: Number(skillLevel),
                avatarFile,
            });
            onClose();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Unable to save bot');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className={s.create_bot_modal_background} onClick={isSaving ? undefined : onClose}>
            <div className={s.modal} onClick={(e) => e.stopPropagation()}>
                {!bot && <div className={s.tabs}>
                    {(Object.keys(ENGINE_CONFIG) as EngineType[]).map(item => (
                        <Button
                            key={item}
                            text={ENGINE_CONFIG[item].title}
                            variant="profile"
                            animation="white-hover"
                            onClick={() => handleEngineChange(item)}
                            active={!isSaving}
                            className={`${s.button} ${engine === item ? s.active_button : ''}`}
                        />
                    ))}
                </div>}

                <div className={s.fields}>
                    <UserAvatar
                        userName={botName || 'Bot'}
                        size={100}
                        imgURL={previewAvatarURL || bot?.avatarURL}
                    />
                    <input
                        id="bot-avatar-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        hidden
                        onChange={handleAvatarChange}
                    />
                    <Button
                        text="Upload Avatar"
                        variant="profile"
                        animation="white-hover"
                        onClick={() => document.getElementById('bot-avatar-upload')?.click()}
                        active={!isSaving}
                        styleProps={{ height: 65 }}
                    />
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

                    {!bot && <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className={s.select}
                        disabled={isSaving}
                    >
                        {skillOptions.map(level => (
                            <option key={level} value={level}>
                                Skill Level {level}
                            </option>
                        ))}
                    </select>}
                </div>

                <div className={s.buttons_container}>
                    <Button
                        text={bot ? 'Save' : 'Create'}
                        variant="profile"
                        animation="white-hover"
                        onClick={handleSave}
                        active={!isSaving && canSave}
                        styleProps={{ flex: '1' }}
                    />

                    <Button
                        text="Cancel"
                        variant="profile"
                        animation="white-hover"
                        onClick={onClose}
                        active={!isSaving}
                        styleProps={{ flex: '1' }}
                    />
                </div>
            </div>
        </div>
    )
}
