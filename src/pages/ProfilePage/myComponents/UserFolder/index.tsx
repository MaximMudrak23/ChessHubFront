import s from './styles.module.scss'
import AvatarPart from '../AvatarPart'
import TextPart from '../TextPart'
import PerksPart from '../PerksPart'

// Вот это все пофиксить, попереносить в компоненты, а еще сделать адаптивнее штуку с лути и сделать еще чтобы иконка была продумана только для штуки с музыкой, пока так пойдет. Ах да, еще чтобы там где показывает ело и все это, это типо разные иконки, можно будет скины делать на место где ело показывает скажем или паки иконок скажем, ну кароч там поведение другое даже должно быть так то, типо при наводке например и так далее, кароч это не одно и то же там отличается не все косметик див и мб никнейм не 500 а вообще убрать или 400

export default function UserFolder() {
    return (
        <div className={s.user_folder}>
            <AvatarPart />
            <TextPart username='Recront' usernameIcons={['/CHECK.svg', '/RED BULL.svg']} description='My heart in the armor from a damascus steel...' />
            <PerksPart />
        </div>
    )
}