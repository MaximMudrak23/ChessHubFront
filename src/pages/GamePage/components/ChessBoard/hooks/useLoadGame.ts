import { useGameSocket } from '../../../hooks/useGameSocket';

export function useLoadGame(id?: string) {
    return useGameSocket(id);
}
