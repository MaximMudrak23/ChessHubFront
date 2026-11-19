// Add a file to public/backgrounds and register its name and URL here.
export const BACKGROUNDS = {
    default: { name: 'Default', url: '/backgrounds/default.jpg' },
    'red-bull': { name: 'Red Bull', url: '/backgrounds/red-bull.webp' },
    wood: { name: 'Wood', url: '/backgrounds/wood.png' },
    'dark-mac': { name: 'Dark Mac', url: '/backgrounds/dark-mac.jpg' },
    city: { name: 'City', url: '/backgrounds/city.png' },
};
// Add board files to public/boards/<id> and register them here; the settings list is built automatically.
export const BOARDS = {
    water: {
        name: 'Water',
        preview: '/boards/water/preview.png',
        blackCell: '/boards/water/black-cell.png',
        whiteCell: '/boards/water/white-cell.png',
        blackLettersColor: '#FFFFFF',
        whiteLettersColor: '#74A0B5',
    }
};
function createPieceSet(folder: string, name: string) {
    const path = `/chess-pieces/${folder}`;

    return {
        name,
        bb: `${path}/bb.png`,
        bk: `${path}/bk.png`,
        bn: `${path}/bn.png`,
        bp: `${path}/bp.png`,
        bq: `${path}/bq.png`,
        br: `${path}/br.png`,
        wb: `${path}/wb.png`,
        wk: `${path}/wk.png`,
        wn: `${path}/wn.png`,
        wp: `${path}/wp.png`,
        wq: `${path}/wq.png`,
        wr: `${path}/wr.png`,
    }
}

// Each folder contains 12 PNGs with standard piece codes; wn.png is always the thumbnail.
// Add a folder to public/chess-pieces and register it here to include it in settings.
export const CHESS_PIECES = {
    default: createPieceSet('default', 'Default'),
    set1: createPieceSet('set-1', 'Set 1'),
    set2: createPieceSet('set-2', 'Set 2'),
    set3: createPieceSet('set-3', 'Set 3'),
    set4: createPieceSet('set-4', 'Set 4'),
    set5: createPieceSet('set-5', 'Set 5'),
    set6: createPieceSet('set-6', 'Set 6'),
    set7: createPieceSet('set-7', 'Set 7'),
    set8: createPieceSet('set-8', 'Set 8'),
    set9: createPieceSet('set-9', 'Set 9'),
    set10: createPieceSet('set-10', 'Set 10'),
    set11: createPieceSet('set-11', 'Set 11'),
    set12: createPieceSet('set-12', 'Set 12'),
    set13: createPieceSet('set-13', 'Set 13'),
    set14: createPieceSet('set-14', 'Set 14'),
    set15: createPieceSet('set-15', 'Set 15'),
    set16: createPieceSet('set-16', 'Set 16'),
    set17: createPieceSet('set-17', 'Set 17'),
    set18: createPieceSet('set-18', 'Set 18'),
    set19: createPieceSet('set-19', 'Set 19'),
};
export const CHESS_SOUNDS = {
    capture: '/chess-sounds/capture.mp3',
    castle: '/chess-sounds/castle.mp3',
    gameEnd: '/chess-sounds/game-end.mp3',
    gameStart: '/chess-sounds/game-start.mp3',
    illegal: '/chess-sounds/illegal.mp3',
    moveCheck: '/chess-sounds/move-check.mp3',
    moveSelf: '/chess-sounds/move-self.mp3',
    notify: '/chess-sounds/notify.mp3',
    promote: '/chess-sounds/promote.mp3',
};
export const LOGO = {
    logo: '/logo/logo.png',
    newLogo: '/logo/new-logo.png',
};
export const SPLASH_SCREEN = {
    background: '/splash-screen/background.png',
    leftHand: '/splash-screen/left-hand.png',
    rightHand: '/splash-screen/right-hand.png',
};
export const SVG = {
    checkmarkLogin: '/svg/checkmark-login.svg',
    checkmark: '/svg/checkmark.svg',
    chessboard: '/svg/chessboard.svg',
    eye: '/svg/eye.svg',
    gear: '/svg/gear.svg',
    house: '/svg/house.svg',
    closeIcon: '/svg/close-icon.svg',
    externalLink: '/svg/external-link.svg',
    labsIcon: '/svg/labs-icon.svg',
    leftArrow: '/svg/left-arrow.svg',
    marketIcon: '/svg/market-icon.svg',
    menuIcon: '/svg/menu-icon.svg',
    more: '/svg/more.svg',
    cup: '/svg/cup.svg',
    optionIcon: '/svg/option-icon.svg', // del ts
    options: '/svg/options.svg',
    profileIcon: '/svg/user-profile.svg',
    adminIcon: '/svg/admin-page.svg',
    profilePause: '/svg/profile-pause.svg',
    profilePlay: '/svg/profile-play.svg',
    rightArrow: '/svg/right-arrow.svg',
    searchIcon: '/svg/user-search.svg',
    logoutIcon: '/svg/user-logout.svg',
    expandIcon: '/svg/expand-icon.svg',
    adminEditIcon: '/svg/admin-edit-icon.svg',
    resignIcon: '/svg/resign-icon.svg',
};
