import type { Player, Players } from "../types/game.types";

export const whitePlayer: Player = {
    side: 'white',
    isCurrentUser: false,
    imgURL: '/special/ygritte.jpg',
    frameURL: '/steam/steam2.png',
    userName: "Snow's Mirror",
    userElo: 2000,
};
export const blackPlayer: Player = {
    side: 'black',
    isCurrentUser: true,
    imgURL: '/special/ygritte.png',
    frameURL: '/steam/steam2.png',
    userName: 'Snow',
    userElo: 2000,
};
export const players: Players = {
    white: whitePlayer,
    black: blackPlayer,
}