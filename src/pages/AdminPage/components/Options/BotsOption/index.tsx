import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import PlayerCard from '../../Cards/PlayerCard'
import CreateBotModal from './components/CreateBotModal'
import { useEffect, useState } from 'react'
import { createAdminBot, updateAdminBot, deleteAdminBot, getAdminBots, disableAdminBot, activateAdminBot} from '@/api/adminApi'
import type { AdminBot, CreateBotData } from '@/api/adminApi'
import { useUserStore } from '@/store/userStore'

export default function BotsOption() {
    const token = useUserStore(s => s.token);
    const [value, setValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [editingBot, setEditingBot] = useState<AdminBot | null>(null);
    const [bots, setBots] = useState<AdminBot[]>([]);

    useEffect(() => {
        if (!token) return;

        const loadBots = async () => {
            try {
                const data = await getAdminBots(token);
                setBots(data.bots);
            } catch (error) {
                console.log(error);
            }
        }

        loadBots();
    }, [token]);

    const handleSaveBot = async (data: CreateBotData) => {
        if (!token) throw new Error('Please sign in again');

        if (editingBot) {
            const res = await updateAdminBot(token, editingBot.id, {
                name: data.name !== editingBot.name ? data.name : undefined,
                avatarFile: data.avatarFile,
            });
            setBots(prev => prev.map(bot => bot.id === editingBot.id ? res.bot : bot));
        } else {
            const res = await createAdminBot(token, data);
            setBots(prev => [res.bot, ...prev]);
        }
    }

    const handleToggleBotStatus = async (bot: AdminBot) => {
        if (!token) return;

        try {
            const data = bot.status === 'disabled'
                ? await activateAdminBot(token, bot.id)
                : await disableAdminBot(token, bot.id);

            setBots(prev =>
                prev.map(item =>
                    item.id === bot.id ? data.bot : item
                )
            );
        } catch (error) {
            console.log(error);
        }
    }

    const filteredBots = bots.filter(bot =>
        bot.name.toLowerCase().includes(value.toLowerCase()) ||
        bot.engine.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <>
            <div className={s.find_container}>
                <Input
                    id='admin-user-search-input'
                    value={value}
                    onChangeHandler={setValue}
                    variant='grey'
                    placeholderText='Find bot...'
                    styleProps={{
                        width: '85%',
                        height: '75px',
                        margin: '32px 0',
                        borderRadius: 10,
                    }}
                />

                <Button
                    text='Create Bot'
                    variant='profile'
                    animation='white-hover'
                    onClick={() => {
                        setEditingBot(null);
                        setIsOpen(true);
                    }}
                    className={s.button}
                />
            </div>

            <div className={s.cards_container}>
                {filteredBots.map(bot => (
                    <PlayerCard
                        key={bot.id}
                        name={bot.name}
                        subtitle={`${bot.engine} • Skill ${bot.skillLevel}`}
                        avatarURL={bot.avatarURL}
                        frameURL={bot.avatarFrameURL}
                        fields={[
                            ['ID', bot.id],
                            ['Name', bot.name],
                            ['Type', bot.botType],
                            ['Engine', bot.engine],
                            ['Skill Level', String(bot.skillLevel)],
                            ['Elo', String(bot.elo)],
                            ['Status', bot.status],
                            ['Description', bot.description || '-'],
                            ['PGN files', String(bot.pgnFiles.length)],
                        ]}
                        deleteText="Delete bot"
                        onEdit={() => {
                            setEditingBot(bot);
                            setIsOpen(true);
                        }}
                        onDelete={async () => {
                            if (!token) return;

                            const confirmed = confirm(`Delete bot "${bot.name}"?`);
                            if (!confirmed) return;

                            try {
                                await deleteAdminBot(token, bot.id);
                                setBots(prev => prev.filter(item => item.id !== bot.id));
                            } catch (error) {
                                alert('You cannot delete this bot while it has an active game');
                                console.log(error);
                            }
                        }}
                        secondaryActionText={bot.status === 'disabled' ? 'Activate bot' : 'Disable bot'}
                        onSecondaryAction={() => handleToggleBotStatus(bot)}
                    />
                ))}
            </div>

            {isOpen && (
                <CreateBotModal
                    bot={editingBot ?? undefined}
                    onClose={() => setIsOpen(false)}
                    onSave={handleSaveBot}
                />
            )}
        </>
    )
}
