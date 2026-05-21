import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Button from '@/components/UI/Button'
import PlayerCard from '../../Cards/PlayerCard'
import CreateBotModal from './components/CreateBotModal'
import { useEffect, useState } from 'react'
import { createAdminBot, deleteAdminBot, getAdminBots, disableAdminBot, activateAdminBot} from '@/api/adminApi'
import type { AdminBot } from '@/api/adminApi'
import { useUserStore } from '@/store/userStore'

export default function BotsOption() {
    const token = useUserStore(s => s.token);
    const [value, setValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
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

    const handleCreateBot = async (data: {
        botType: 'stockfish' | 'mirror' | 'personality';
        name: string;
        skillLevel: number;
    }) => {
        if (!token) return;

        try {
            const res = await createAdminBot(token, data);
            setBots(prev => [res.bot, ...prev]);
        } catch (error) {
            console.log(error);
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
        bot.botType.toLowerCase().includes(value.toLowerCase())
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
                    onClick={() => setIsOpen(true)}
                    className={s.button}
                />
            </div>

            <div className={s.cards_container}>
                {filteredBots.map(bot => (
                    <PlayerCard
                        key={bot.id}
                        name={bot.name}
                        subtitle={`${bot.botType} • Skill ${bot.skillLevel}`}
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
                        onDelete={async () => {
                            if (!token) return;

                            const confirmed = confirm(`Delete bot "${bot.name}"?`);
                            if (!confirmed) return;

                            await deleteAdminBot(token, bot.id);

                            setBots(prev => prev.filter(item => item.id !== bot.id));
                        }}
                        secondaryActionText={bot.status === 'disabled' ? 'Activate bot' : 'Disable bot'}
                        onSecondaryAction={() => handleToggleBotStatus(bot)}
                    />
                ))}
            </div>

            {isOpen && (
                <CreateBotModal
                    onClose={() => setIsOpen(false)}
                    onCreate={handleCreateBot}
                />
            )}
        </>
    )
}