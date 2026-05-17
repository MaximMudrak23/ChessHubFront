import s from './styles.module.scss'
import Input from '@/components/UI/Input'
import Textarea from '@/components/UI/Textarea'
import Button from '@/components/UI/Button'
import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { updateProfile } from '@/api/userApi'

export default function GeneralOption() {
    const user = useUserStore(s => s.user);
    const token = useUserStore(state => state.token);
    const setUser = useUserStore(state => state.setUser);

    const [nameValue, setNameValue] = useState<string>('');
    const [descriptionValue, setDescriptionValue] = useState<string>('');
    
    useEffect(() => {
        if (!user) return;

        setNameValue(user.name);
        setDescriptionValue(user.description || '');
    }, [user]);

    if (!user || !token) return null;

    const handleSave = async () => {
        try {
            const data = await updateProfile(token, {
                name: nameValue,
                description: descriptionValue,
            });

            setUser(data.user);
        } catch (error) {
            console.log(error);
            alert("Error! I can't update")
        }
    }

    const handleCancel = () => {
        setNameValue(user.name);
        setDescriptionValue(user.description || '');
    }

    return (
        <>
            <div className={s.inputs_container}>
                <Input
                    id={'nameValue'}
                    value={nameValue}
                    onChangeHandler={setNameValue}
                    variant='profile'
                    placeholderText="Name"
                    styleProps={{height: '65px'}}
                />
               <Textarea
                    id="descriptionValue"
                    value={descriptionValue}
                    onChangeHandler={setDescriptionValue}
                    variant="profile"
                    placeholderText="Description"
                />
            </div>
            <div className={s.buttons_container}>
                <Button
                    text='Save'
                    variant='profile'
                    animation='white-hover'
                    onClick={handleSave}
                    styleProps={{flex: '1'}}
                />
                <Button
                    text='Cancel'
                    variant='profile'
                    animation='white-hover'
                    onClick={handleCancel}
                    styleProps={{flex: '1'}}
                />
            </div>
        </>
    )
}