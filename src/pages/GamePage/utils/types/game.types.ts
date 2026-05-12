import type { IconType } from '@/types/user.types'

export type Side = 'white' | 'black';

export type Player = {
    side: Side;
    userId: string;
    imgURL?: string;
    frameURL?: string;
    userName: string;
    userElo: number;
    userIcons?: IconType[];
};

export type Players = {
    white: Player;
    black: Player;
}

export type Move = {
    whiteMove: string;
    blackMove?: string;
};