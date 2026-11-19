export type GameHistoryPlayerDTO = {
    name: string | null;
    avatarURL: string | null;
    // Historical rating at the start of this game.
    elo: number | null;
};

export type GameHistoryGameDTO = {
    id: string;
    white: GameHistoryPlayerDTO;
    black: GameHistoryPlayerDTO;
    result: 'win' | 'loss' | 'draw';
    movesCount: number;
    finishedAt: string;
};

export type GameHistoryPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
};

export type GameHistoryResponse = {
    games: GameHistoryGameDTO[];
    pagination: GameHistoryPagination;
};
