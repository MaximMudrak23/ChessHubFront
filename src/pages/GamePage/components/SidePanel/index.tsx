import s from './styles.module.scss'
import UserCard from '../../../../components/User/UserCard';
import MoveRow from './components/MoveRow';
import Button from '@/components/UI/Button';
import type { Players, Side, Move } from '../../utils/types/game.types';
import { getSortedUsers } from './utils/getSortedUsers';
import { useEffect, useRef } from 'react';
import { SVG } from '@/constants/paths';
import { useResignGame } from '../../hooks/useResignGame';
import { useGameStore } from '@/store/gameStore';
import type { NavigationCommand } from '../../utils/moveNavigation';

type Props = {
    players: Players;
    perspective: Side;
    moves?: Move[];
    currentTurn: Side;
    viewedPly: number;
    canNavigate: boolean;
    onSelectPly: (ply: number) => void;
    navigationPly: number;
    lastNavigationPly: number;
    isVariation: boolean;
    onNavigate: (command: NavigationCommand) => void;
}

export default function SidePanel(props: Props) {
    const {canResign, resignGame} = useResignGame();
    const moveError = useGameStore(s => s.moveError);

    const sortedUsers = getSortedUsers(props.players, props.perspective);
    const movesRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = movesRef.current;
        if (!el) return;
        el.querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest' });
        if (props.viewedPly === 0) el.scrollTop = 0;
    }, [props.viewedPly]);

    return (
        <div className={s.side_panel}>
            <div className={s.users_folder}>
                {sortedUsers.map(user => (
                    <UserCard
                        key={user.side}
                        imgURL={user.imgURL}
                        frameURL={user.frameURL}
                        userName={user.userName}
                        userIcons={user.userIcons}
                        userElo={user.userElo}
                        variation={'card'}
                        isActive={user.side === props.currentTurn}
                    />
                ))}
            </div>

            <div className={s.moves_folder}>
                <div className={s.title}>
                    <img src={SVG.chessboard} alt="Moves Folder Title Icon" draggable={false} />
                </div>
                <div className={s.moves} ref={movesRef}>
                    {props.moves && props.moves.map(({whiteMove, blackMove}, i) => (
                        <MoveRow
                            key={i}
                            moveNumber={i+1}
                            whiteMove={whiteMove}
                            blackMove={blackMove}
                            viewedPly={props.viewedPly}
                            canNavigate={props.canNavigate}
                            onSelectPly={props.onSelectPly}
                        />
                    ))}
                </div>
            </div>

            <nav className={s.navigation} aria-label="Move navigation">
                <button type="button" aria-label="Initial position" title="Initial position (↓)"
                    disabled={!props.canNavigate || props.navigationPly === 0} onClick={() => props.onNavigate('start')}>⏮</button>
                <button type="button" aria-label="Previous half-move" title="Previous half-move (←)"
                    disabled={!props.canNavigate || props.navigationPly === 0} onClick={() => props.onNavigate('previous')}>←</button>
                <span aria-live="polite">{props.navigationPly} / {props.lastNavigationPly}</span>
                <button type="button" aria-label="Next half-move" title="Next half-move (→)"
                    disabled={!props.canNavigate || props.navigationPly === props.lastNavigationPly} onClick={() => props.onNavigate('next')}>→</button>
                <button type="button" aria-label="Latest position" title="Latest position (↑)"
                    disabled={!props.canNavigate || props.navigationPly === props.lastNavigationPly} onClick={() => props.onNavigate('end')}>⏭</button>
            </nav>
            {props.isVariation && <div className={s.variation} role="status">
                <span>Local variation</span>
                <button type="button" onClick={() => props.onSelectPly(props.viewedPly)}>Return to recorded position</button>
            </div>}
            {!props.canNavigate && <p className={s.notice} role="status">
                Move navigation is unavailable: position history is missing, incomplete or invalid. Showing the latest position.
            </p>}
            {moveError && <p className={s.notice} role="alert">{moveError}</p>}

            {canResign &&
                <div className={s.button_folder}>
                    <Button
                        icon={SVG.resignIcon}
                        active={true}
                        variant='glass'
                        animation='white-hover'
                        onClick={resignGame}
                        className={s.button}
                    />
                </div>
            }
        </div>
    )
}
