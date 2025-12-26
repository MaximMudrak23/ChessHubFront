import s from './styles.module.scss'

type Variant = 'profile' | 'card';

type Props = 
    | { personaState: 'offline'; variant: Variant; }
    | { personaState: 'online'; variant: Variant; }
    | { personaState: 'ingame'; gameStatus?: string; variant: Variant; }

export default function PersonaState(props: Props) {
    const {personaState, variant} = props;
    const stateVariant = variant === 'profile' ? s.variant_profile : s.variant_card ;
    return (
        <div className={s.persona_state}>
            {personaState === 'offline' && <p className={`${s.offline} ${stateVariant}`}>Currently Offline</p>}
            {personaState === 'online' && <p className={`${s.online} ${stateVariant}`}>Currently Online</p>}
            {personaState === 'ingame' && <p className={`${s.ingame} ${stateVariant}`}>Currently In-Game</p>}
            {(personaState === 'ingame' && variant === 'profile' && props.gameStatus) && <p className={s.ingame_event}>{props.gameStatus}</p>}
        </div>
    )
}