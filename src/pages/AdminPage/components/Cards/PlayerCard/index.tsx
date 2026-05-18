import s from './styles.module.scss'
import UserAvatar from '@/components/User/UserAvatar';
import Button from '@/components/UI/Button';
import clsx from 'clsx';

import { SVG } from '@/constants/paths';
import { useState } from 'react';
import { deleteAdminUser } from '@/api/adminApi';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/types/user.types';

type Props = {
    user: User;
    onDelete: (id: string) => void;
}

export default function PlayerCard({user, onDelete}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const token = useUserStore(s => s.token);

    const fields = [
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
    ];

    const handleDelete = async () => {
        if (!token) return;

        const confirmed = confirm(`Delete "${user.name}" account?`);
        if (!confirmed) return;

        try {
            await deleteAdminUser(token, user.id);
            onDelete(user.id);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={s.player_card}>
            <div className={s.small_card}>
                <div className={s.avatar_container}>
                    <UserAvatar
                        userName={`${user.name} Avatar`}
                        size={100}
                        imgURL={user.avatarURL}
                        frameURL={user.avatarFrameURL}
                    />
                </div>

                <div className={s.short_info_container}>
                    <p className={`${s.short_info} ${s.name}`}>{user.name}</p>
                    <p className={`${s.short_info} ${s.email}`}>{user.email}</p>
                </div>

                <div className={clsx(s.expand_button_container, isOpen && s.expand_button_container_rotate)}>
                    <Button
                        icon={SVG.expandIcon}
                        variant={'transparent'}
                        onClick={() => setIsOpen(x => !x)}
                        className={s.expand_button}
                    />
                </div>
            </div>

            <div className={clsx(s.details, isOpen && s.open)}>
                {fields.map(([title, value]) => (
                    <div className={s.details_field} key={title}>
                        <div className={s.title}>
                            <span>{title}</span>
                        </div>

                        <div className={s.value}>
                            <span>{value}</span>
                        </div>
                    </div>
                ))}

                <div className={s.buttons_container}>
                    <Button
                        text="Delete account"
                        variant="profile"
                        animation="white-hover"
                        onClick={handleDelete}
                        styleProps={{flex: 1, height: 65}}
                    />
                </div>
            </div>
        </div>
    )
}