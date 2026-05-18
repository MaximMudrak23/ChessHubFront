import s from './styles.module.scss'
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import KeyCard from '../../Cards/KeyCard';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { createAdminKey, deleteAdminKey, getAdminKeys } from '@/api/adminApi';

type AdminKey = {
    _id: string;
    code: string;
    createdAt: string;
    updatedAt: string;
};

export default function KeysOption() {
    const token = useUserStore(s => s.token);

    const [value, setValue] = useState('');
    const [keys, setKeys] = useState<AdminKey[]>([]);

    useEffect(() => {
        if (!token) return;

        const loadKeys = async () => {
            const data = await getAdminKeys(token);
            setKeys(data.keys);
        }

        loadKeys();
    }, [token]);

    const handleCreate = async () => {
        if (!token) return;

        const data = await createAdminKey(token);
        setKeys(prev => [data.key, ...prev]);
    }

    const handleDelete = async (id: string) => {
        if (!token) return;

        await deleteAdminKey(token, id);
        setKeys(prev => prev.filter(key => key._id !== id));
    }

    const filteredKeys = keys.filter(key =>
        key.code.toLowerCase().includes(value.toLowerCase())
    );

    return (
        <>
            <div className={s.find_container}>
                <Input
                    id='admin-key-search-input'
                    value={value}
                    onChangeHandler={setValue}
                    variant='grey'
                    placeholderText='Find key...'
                    styleProps={{
                        width: '85%',
                        height: '75px',
                        margin: '32px 0',
                        borderRadius: 10,
                    }}
                />
                <Button
                    text='Create Key'
                    variant='profile'
                    animation='white-hover'
                    onClick={handleCreate}
                    styleProps={{
                        flex: '1',
                        padding: '12px',
                        borderRadius: 10,
                    }}
                />
            </div>

            <div className={s.cards_container}>
                {filteredKeys.map(key => (
                    <KeyCard
                        key={key._id}
                        keyValue={key.code}
                        onDelete={() => handleDelete(key._id)}
                    />
                ))}
            </div>
        </>
    )
}