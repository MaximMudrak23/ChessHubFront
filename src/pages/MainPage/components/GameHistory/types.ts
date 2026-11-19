export type GameHistoryPlayer = {
    name: string;
    avatarURL?: string;
    eloAtStart: number | null;
};

// View data uses the historical elo from the API as eloAtStart.
export type GameHistoryEntry = {
    id: string;
    white: GameHistoryPlayer;
    black: GameHistoryPlayer;
    result: 'win' | 'loss' | 'draw';
    movesCount: number;
    finishedAt: string;
};
