import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import PlayerCard from '../../Cards/PlayerCard';
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { getAdminUsers, deleteAdminUser } from '@/api/adminApi'
import type { User } from '@/types/user.types'

export default function UserOption() {
    const token = useUserStore(s => s.token);

    const [value, setValue] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!token) return;

        const loadUsers = async () => {
            try {
                const data = await getAdminUsers(token);
                setUsers(data.users);
            } catch (error) {
                console.log(error);
            }
        }

        loadUsers();
    }, [token]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <>
            <div className={s.find_container}>
                <Input
                    id='admin-user-search-input'
                    value={value}
                    onChangeHandler={setValue}
                    variant='grey'
                    placeholderText='Who you want to find?'
                    styleProps={{
                        width: '85%',
                        height: '75px',
                        margin: '32px 0',
                        borderRadius: 10,
                    }}
                />
            </div>

            <div className={s.cards_container}>
                {filteredUsers.map(user => (
                    <PlayerCard
                        key={user.id}
                        name={user.name}
                        subtitle={user.email}
                        avatarURL={user.avatarURL}
                        frameURL={user.avatarFrameURL}
                        fields={[
                            ['ID', user.id],
                            ['Name', user.name],
                            ['Email', user.email],
                            ['Role', user.role],
                            ['Elo', String(user.elo)],
                            ['Description', user.description || '-'],
                            ['Avatar URL', user.avatarURL || '-'],
                            ['Frame URL', user.avatarFrameURL || '-'],
                            ['Board Theme', user.boardTheme],
                            ['Menu Background', user.menuBackground],
                        ]}
                        deleteText="Delete account"
                        onDelete={async () => {
                            if (!token) return;

                            const confirmed = confirm(`Delete "${user.name}" account?`);
                            if (!confirmed) return;

                            await deleteAdminUser(token, user.id);

                            setUsers(prev => prev.filter(item => item.id !== user.id));
                        }}
                    />
                ))}
            </div>
        </>
    )
}