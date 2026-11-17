import { BACKGROUNDS, BOARDS, CHESS_PIECES } from '@/constants/paths';
import type { AppearanceSettings, BoardTheme, MenuBackground, PieceSet } from '@/types/user.types';
import { getMenuBackground } from './getMenuBackground';

export function getAppearance(settings?: Partial<AppearanceSettings> | null) {
    const boardTheme = settings?.boardTheme;
    const pieceSet = settings?.pieceSet;
    const background = getMenuBackground(settings?.menuBackground);

    return {
        boardTheme: boardTheme && Object.hasOwn(BOARDS, boardTheme)
            ? boardTheme as BoardTheme : 'water',
        pieceSet: pieceSet && Object.hasOwn(CHESS_PIECES, pieceSet)
            ? pieceSet as PieceSet : 'default',
        menuBackground: (Object.keys(BACKGROUNDS) as MenuBackground[])
            .find(id => BACKGROUNDS[id] === background) ?? 'default',
    };
}
