import s from './styles.module.scss'
import Input from '../../../../../../components/UI/Input'
import { useState } from 'react'

export default function FindFolder() {
    const [value,setValue] = useState('');

    return (
        <div className={s.find_folder}>
            <Input
                type='text'
                shape='find_folder'
                placeholderText='Find user...'
                value={value}
                onChangeX={(value) => setValue(value)}
            />
            {/* <Button
                variant='txt'
                text='Find'
                shape='find_shape'
                onClick={()=>''}
            /> */}
        </div>
    )
}