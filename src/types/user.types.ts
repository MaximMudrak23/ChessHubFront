export type IconType = { title: string; iconURL: string; }
export type BoardTheme = 'water'
export type MenuBackground = 'default' | 'red-bull' | 'wood';
export type UserRole = 'user' | 'admin';
export type ProfileSong = {
    songAvatar: string;
    songName: string;
    songURL: string;
}

export type User = {
    id: string;
    name: string;
    email: string;
    elo: number;
    role: UserRole;
    userIcons?: IconType[];
    description?: string;
    avatarURL?: string
    avatarFrameURL?: string;
    profileBackgroundURL?: string;
    profileSong?: ProfileSong;
    boardTheme: BoardTheme;
    menuBackground: MenuBackground;
}