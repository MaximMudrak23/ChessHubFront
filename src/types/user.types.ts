import type { BACKGROUNDS, BOARDS, CHESS_PIECES } from '@/constants/paths';

export type IconType = { title: string; iconURL: string; }
export type BoardTheme = keyof typeof BOARDS;
export type PieceSet = keyof typeof CHESS_PIECES;
export type MenuBackground = keyof typeof BACKGROUNDS;
export type UserRole = 'user' | 'admin';
export type ProfileBackground = {
    type: 'image' | 'video';
    url: string;
}
export type ProfileSong = {
    songName: string;
    songAuthor: string;
    songURL: string;
    songAvatarURL: string;
}

export type User = {
    id: string;
    isBot?: boolean;
    name: string;
    email: string;
    elo: number;
    role: UserRole;
    userIcons?: IconType[];
    description?: string;
    avatarURL?: string
    avatarFrameURL?: string;
    unlockedFrames: string[];
    unlockedProfileBackgrounds: ProfileBackground[];
    unlockedProfileSongs: ProfileSong[];
    profileBackground?: ProfileBackground;
    profileSong?: ProfileSong;
    boardTheme: string;
    pieceSet: string;
    menuBackground: string;
}

export type AppearanceSettings = Pick<User, 'boardTheme' | 'pieceSet' | 'menuBackground'>;

export type AuthResponse = {
    user: User;
    token: string;
}
