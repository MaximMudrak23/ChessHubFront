import { Link } from 'react-router-dom';
import clsx from 'clsx';
import UserAvatar from '@/components/User/UserAvatar';
import UserName from '@/components/User/UserName';
import Button from '@/components/UI/Button';
import type { GameHistoryEntry, GameHistoryPlayer } from './types';
import s from './styles.module.scss';

type Props = {
    games?: readonly GameHistoryEntry[];
    isLoading?: boolean;
    error?: string | null;
    hasMore?: boolean;
    onLoadMore?: () => void;
    onRetry?: () => void;
};

const resultLabels = { win: 'Win', loss: 'Loss', draw: 'Draw' };
const resultCutouts = {
    win: 'M14 7H18V14H25V18H18V25H14V18H7V14H14Z',
    loss: 'M7 14H25V18H7Z',
    draw: 'M7 10H25V14H7ZM7 18H25V22H7Z',
};
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
});

function PlayerInfo({ player }: { player: GameHistoryPlayer }) {
    return (
        <div className={s.player}>
            <UserAvatar userName={player.name} imgURL={player.avatarURL} size={28} />
            <UserName userName={player.name} variation='card' className={s.player_name} />
            <span className={s.rating}>({player.eloAtStart ?? '—'})</span>
        </div>
    );
}

function HistoryRow({ game }: { game: GameHistoryEntry }) {
    const date = new Date(game.finishedAt);
    const validDate = !Number.isNaN(date.getTime());
    const formattedDate = validDate ? dateFormatter.format(date).replaceAll('/', '.') : '—';

    return (
        <tr className={s.row}>
            <td>
                <Link
                    to={`/game/${encodeURIComponent(game.id)}`}
                    className={s.game_link}
                    aria-label={`View game between ${game.white.name} and ${game.black.name} from ${formattedDate}`}
                >
                    <div className={s.players}>
                        <PlayerInfo player={game.white} />
                        <PlayerInfo player={game.black} />
                    </div>
                </Link>
            </td>
            <td>
                <svg
                    className={clsx(s.result, s[game.result])}
                    width='32' height='32' viewBox='0 0 32 32'
                    fill='currentColor' role='img' aria-label={resultLabels[game.result]}
                >
                    <path
                        fillRule='evenodd'
                        d={`M7 0H25A7 7 0 0 1 32 7V25A7 7 0 0 1 25 32H7A7 7 0 0 1 0 25V7A7 7 0 0 1 7 0Z${resultCutouts[game.result]}`}
                    />
                </svg>
            </td>
            <td>{game.movesCount}</td>
            <td>
                <time dateTime={validDate ? game.finishedAt : undefined}>{formattedDate}</time>
            </td>
        </tr>
    );
}

export default function GameHistory({ games, isLoading = false, error, hasMore, onLoadMore, onRetry }: Props) {
    let message: string | null = null;
    if (isLoading) message = games?.length ? 'Loading more games…' : 'Loading game history…';
    else if (error) message = error;
    else if (!games?.length) message = games ? 'Your game history is empty.' : 'Game history is not available yet.';
    const action = error ? onRetry : hasMore ? onLoadMore : undefined;

    return (
        <section className={s.history} aria-labelledby='game-history-title' aria-busy={isLoading}>
            <h2 id='game-history-title' className={s.title}>Game History</h2>
            <div className={s.table_wrapper} tabIndex={0} role='region' aria-label='Game history table'>
                <table className={s.table} aria-labelledby='game-history-title'>
                    <colgroup>
                        <col className={s.players_column} />
                        <col className={s.result_column} />
                        <col className={s.moves_column} />
                        <col className={s.date_column} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope='col'>Players</th>
                            <th scope='col'>Result</th>
                            <th scope='col'>Moves</th>
                            <th scope='col'>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games?.map(game => (
                            <HistoryRow key={game.id} game={game} />
                        ))}
                    </tbody>
                </table>
            </div>
            {message && (
                <p className={s.empty} role={error ? 'alert' : 'status'}>
                    {message}
                </p>
            )}
            {action && (
                <div className={s.actions}>
                    <Button
                        text={error ? 'Try again' : isLoading ? 'Loading…' : 'Load more'}
                        variant='glass'
                        animation='game'
                        className={s.action_button}
                        active={!isLoading}
                        onClick={action}
                    />
                </div>
            )}
        </section>
    );
}
