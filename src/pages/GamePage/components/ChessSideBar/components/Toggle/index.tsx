import s from './styles.module.scss'
import Button from '../../../../../../components/UI/Button'
import Moves from './components/Moves'
import Chat from './components/Chat'

type Props = {
    activeTab: 'moves' | 'chat';
    setActiveTab: (value: 'moves' | 'chat') => void
}

export default function Toggle({activeTab, setActiveTab}: Props) {
    return (
        <div className={s.moves_chat}>
            <div className={s.button_folder}>
                <Button
                    variant="img"
                    imgURL="/all/chess.svg"
                    shape="tab_shape"
                    active={activeTab === 'moves'}
                    onClick={() => setActiveTab('moves')}
                />
                <Button
                    variant="img"
                    imgURL="/all/chat.svg"
                    shape="tab_shape"
                    active={activeTab === 'chat'}
                    onClick={() => setActiveTab('chat')}
                />
            </div>
            <div className={s.info_folder}>
                {activeTab === 'moves' && <Moves />}
                {activeTab === 'chat' && <Chat />}
            </div>
        </div>
    )
}