import Input from '../../../../../../../../components/UI/Input';
import Button from '../../../../../../../../components/UI/Button';

// изактив пофиксить, запретить символы в ключе все кроме - и в пароле и логине тоже запретить символы все, ну мб в логине разрешить _ и .

type SignInData = {
    login: string;
    password: string;
    email: string;
    key: string;
}

type Props = {
    data: SignInData;
    setData: React.Dispatch<React.SetStateAction<SignInData>>;
}

export default function SignIn({data, setData}: Props) {
    const isActive = !!(data.login.trim() && data.password.trim() && data.key.trim());
    return (
        <>
            <Input
                shape={'welcome_shape'}
                type={'text'}
                id={'Login'}
                value={data.login}
                onChangeX={(v) => setData(x => ({...x, login: v}))}
            />
            <Input
                shape={'welcome_shape'}
                type={'password'}
                id={'Password'}
                value={data.password}
                onChangeX={(v) => setData(x => ({...x, password: v}))}
            />
            <Input
                shape={'welcome_shape'}
                type={'email'}
                id={'Email'}
                value={data.email}
                onChangeX={(v) => setData(x => ({...x, email: v}))}
            />
            <Input
                shape={'welcome_shape'}
                type={'text'}
                id={'KEY'}
                value={data.key}
                onChangeX={(v) => setData(x => ({...x, key: v}))}
            />
            <Button
                variant={'txt'}
                text={'Welcome!'}
                shape={'welcome_shape'}
                active={isActive}
                onClick={() => setData(x => ({...x, stage: 2}))}
            />
        </>
    )
}