import s from './styles.module.scss'
import Input from '@/components/UI/Input'

import { useState } from 'react';

export default function UserOption() {
    const [value, setValue] = useState('');

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

            </div>
        </>
    )
}