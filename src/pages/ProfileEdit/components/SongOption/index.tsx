import s from './styles.module.scss'
import Button from '@/components/UI/Button'

export default function SongOption() {
    
    return (
        <>
            
            <div className={s.buttons_container}>
                <Button
                    text='Save'
                    variant='profile'
                    animation='white-hover'
                    onClick={()=>{}}
                    styleProps={{flex: '1'}}
                />
                <Button
                    text='Cancel'
                    variant='profile'
                    animation='white-hover'
                    onClick={()=>{}}
                    styleProps={{flex: '1'}}
                />
            </div>
        </>
    )
}