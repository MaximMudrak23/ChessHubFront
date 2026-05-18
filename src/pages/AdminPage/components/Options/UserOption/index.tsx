import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import PlayerCard from '../../Cards/PlayerCard';
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { getAdminUsers } from '@/api/adminApi'
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
                    id='admin-search-input'
                    value={value}
                    onChangeHandler={setValue}
                    variant='grey'
                    placeholderText='Who you want to find?'
                    styleProps={{
                        width: '85%',
                        height: '75px',
                        margin: '32px 0',
                        borderRadius: 9999,
                    }}
                />
            </div>

            <div className={s.cards_container}>
                {filteredUsers.map(user => (
                    <PlayerCard
                        key={user.id}
                        user={user}
                        onDelete={id => {
                            setUsers(prev => prev.filter(user => user.id !== id));
                        }}
                    />
                ))}
            </div>
        </>
    )
}