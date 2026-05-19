import s from './styles.module.scss'
import UserAvatar from '@/components/User/UserAvatar';
import Button from '@/components/UI/Button';
import clsx from 'clsx';

import { SVG } from '@/constants/paths';
import { useState } from 'react';

type Props = {
    name: string;
    subtitle?: string;
    avatarURL?: string;
    frameURL?: string;
    fields: [string, string][];
    onDelete: () => void;
    deleteText?: string;
}

export default function PlayerCard({
    name,
    subtitle,
    avatarURL,
    frameURL,
    fields,
    onDelete,
    deleteText = 'Delete account',
}: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={s.player_card}>
            <div className={s.small_card}>
                <div className={s.avatar_container}>
                    <UserAvatar
                        userName={`${name} Avatar`}
                        size={100}
                        imgURL={avatarURL}
                        frameURL={frameURL}
                    />
                </div>

                <div className={s.short_info_container}>
                    <p className={`${s.short_info} ${s.name}`}>{name}</p>
                    <p className={`${s.short_info} ${s.email}`}>{subtitle}</p>
                </div>

                <div className={clsx(s.expand_button_container, isOpen && s.expand_button_container_rotate)}>
                    <Button
                        icon={SVG.expandIcon}
                        variant="transparent"
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
                        text={deleteText}
                        variant="profile"
                        animation="white-hover"
                        onClick={onDelete}
                        styleProps={{ flex: 1, height: 65 }}
                    />
                </div>
            </div>
        </div>
    )
}