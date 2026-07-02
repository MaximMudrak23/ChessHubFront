export const ENGINE_CONFIG = {
    stockfish: {
        title: 'Stockfish',
        minSkill: 0,
        maxSkill: 20,
        defaultSkill: 5,
    },

    komodo: {
        title: 'Komodo',
        minSkill: 1,
        maxSkill: 25,
        defaultSkill: 5,
    },

    dragon: {
        title: 'Dragon',
        minSkill: 1,
        maxSkill: 25,
        defaultSkill: 5,
    },
} as const;

export type EngineType = keyof typeof ENGINE_CONFIG;