export type IconType = { title: string; iconURL: string; }
export type BoardTheme = 'water'
export type MenuBackground = 'default' | 'red-bull' | 'wood';
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
    boardTheme: BoardTheme;
    menuBackground: MenuBackground;
}

export type AuthResponse = {
    user: User;
    token: string;
}