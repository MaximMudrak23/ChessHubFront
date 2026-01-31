import Input from '../../../../../../../../components/UI/Input';
import Button from '../../../../../../../../components/UI/Button';

// изактив пофиксить, запретить символы в ключе все кроме - и в пароле и логине тоже запретить символы все, ну мб в логине разрешить _ и .

type SignInData = {
    stage: 1 | 2;
    login: string;
    password: string;
    key: string;
    username: string;
    email: string;
}

type Props = {
    data: SignInData;
    setData: React.Dispatch<React.SetStateAction<SignInData>>;
}

export default function SignIn({data, setData}: Props) {
    const isActive1 = !!(data.login.trim() && data.password.trim() && data.key.trim());
    const isActive2 = !!(data.username.trim() && data.email.trim());

    return (
        <>
            {data.stage === 1 &&
                <>
                    <Input
                        shape='welcome_shape'
                        type={'text'} id={'Login'}
                        value={data.login}
                        onChangeX={(v) => setData(x => ({...x, login: v}))}
                    />
                    <Input
                        shape='welcome_shape'
                        type={'password'}
                        id={'Password'}
                        value={data.password}
                        onChangeX={(v) => setData(x => ({...x, password: v}))}
                    />
                    <Input
                        shape='welcome_shape'
                        type={'text'}
                        id={'KEY'}
                        value={data.key}
                        onChangeX={(v) => setData(x => ({...x, key: v}))}
                    />
                    <Button
                        variant={'txt'}
                        text={'Next Stage'}
                        shape={'welcome_shape'}
                        active={isActive1}
                        onClick={() => setData(x => ({...x, stage: 2}))}
                    />
                </>
            }

            {data.stage === 2 &&
                <>
                    <Button
                        variant={'txtimg'}
                        imgURL={'/all/ar1.svg'}
                        text={'Back'}
                        shape={'back_shape'}
                        onClick={() => setData(x => ({...x, stage: 1}))}
                    />
                    <Input
                        shape='welcome_shape'
                        type={'text'}
                        id={'Login'}
                        value={data.username}
                        onChangeX={(v) => setData(x => ({...x, username: v}))}
                    />
                    <Input
                        shape='welcome_shape'
                        type={'email'}
                        id={'Email'}
                        value={data.email}
                        onChangeX={(v) => setData(x => ({...x, email: v}))}
                    />
                    <Button
                        variant={'txt'}
                        text={'Welcome!'}
                        shape={'welcome_shape'}
                        active={isActive2}
                        onClick={()=>''}
                    />
                </>
            }
        </>
    )
}