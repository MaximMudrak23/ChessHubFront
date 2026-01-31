import Input from '../../../../../../../../components/UI/Input'
import Button from '../../../../../../../../components/UI/Button'

type SignUpData = {
    login: string;
    password: string;
}

type Props = {
    data: SignUpData;
    setData: React.Dispatch<React.SetStateAction<SignUpData>>
}

export default function SignUp({data, setData}: Props) {
    const isActive = !!(data.login.trim() && data.password.trim());
    return (
        <>
            <Input
                type='text'
                shape='welcome_shape'
                id='Login'
                value={data.login}
                onChangeX={(v) => setData(x => ({...x, login: v}))}
            />
            <Input
                type='password'
                shape='welcome_shape'
                id='Password'
                value={data.password}
                onChangeX={(v) => setData(x => ({...x, password: v}))}
            />
            <Button
                variant='txt'
                text='Welcome!'
                shape='welcome_shape'
                active={isActive}
                onClick={()=>''}
            />
        </>
    )
}