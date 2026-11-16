import { useGameSocket } from '../../../hooks/useGameSocket';

export function useLoadGame(id?: string) {
    useGameSocket(id);
}
