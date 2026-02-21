import s from './styles.module.scss'
import Input from '../../../../../../components/UI/Input'

export default function InputsFolder() {
    return (
        <div className={s.inputs_folder}>
            <Input variant='fluid-gradient' placeholderText='Login' styleProps={{ width: '75%', height: '64px' }} />
            <Input variant='fluid-gradient' placeholderText='Password' styleProps={{ width: '75%', height: '64px' }} />
            <Input variant='fluid-gradient' placeholderText='Mail' styleProps={{ width: '75%', height: '64px' }} />
            <Input variant='fluid-gradient' placeholderText='Key' styleProps={{ width: '75%', height: '64px' }} />
        </div>
    )
}