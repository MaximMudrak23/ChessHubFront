// This is file for not real global state just for test, later this file will be deleted
import { SVG, BOARDS, BACKGROUNDS } from "@/constants/paths"

export const globalState = {
    id: 'USER1',
    name: 'Recront',
    userIcons: [{title: 'Developer', iconURL: SVG.checkmark}],
    description: 'Welcome to my profile',
    elo: 2000,
    avatarURL: '/other/steamgif.gif',
    avatarFrameURL: null,
    profileBackground: null,
    profileSongName: "U waren't here, but I really miss you",
    profileSongAvatar: '/other/steamgif.gif',
    role: 'Admin',
    boardTheme: {
        lightSquare: BOARDS.water.whiteCell,
        darkSquare: BOARDS.water.blackCell,
        lightLetters: '#74A0B5',
        darkLetters: '#FFFFFF',
    },
    background: BACKGROUNDS.default,
}