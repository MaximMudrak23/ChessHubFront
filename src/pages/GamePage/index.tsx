import s from './styles.module.scss'
import ChessBoard from './components/ChessBoard'
import SidePanel from './components/SidePanel'
import type { Player, Move } from './components/SidePanel/utils/items.types';

const testWhitePlayer: Player = {
    side: 'white',
    isCurrentUser: false,
    imgURL: '/special/ygritte.jpg',
    frameURL: '/steam/steam2.png',
    userName: "Snow's Mirror",
    userElo: 2000,
    userIcons: ['/all/RED BULL.svg'],
};
const testBlackPlayer: Player = {
    side: 'black',
    isCurrentUser: true,
    imgURL: '/special/ygritte.png',
    frameURL: '/steam/steam2.png',
    userName: 'Snow',
    userElo: 2000,
    userIcons: ['/all/RED BULL.svg'],
};
const testMoves: Move[] = [
    {whiteMove: 'e4', blackMove: 'e5'},
    {whiteMove: 'e4'},
];

export default function GamePage() {
    return (
        <section className={s.game_page}>
            <ChessBoard perspective='black' />
            <SidePanel
                players={{
                    white: testWhitePlayer,
                    black: testBlackPlayer,
                }}
                moves={testMoves}
            />
        </section>
    )
}

/**
 * Правила движения фигур:
 * - кликнул на свою фигуру а затем на другую - выбор меняется.
 * - кликнул на свою фигуру а затем на пустое место (не клетку, не доску в целом) значит выбор анулируется
 * - кликнул на свою фигуру а затем на клетку на которую не можешь пойти, значит выбор анулируется (звук воспроизводится)
 * - кликнул на свою фигуру а затем на фигуру которую взять не можешь (перед ней другая фигура и т.д.) значит выбор анулируется (звук воспроизводится)
 * - кликнул на фигуру врага, ничего не случилось, на фигуры врага можно кликать только когда выбрал свою фигуру
 * - кликнул на свою фигуру и нажал на клетку на которую можешь пойти или на врага которого можешь взять, все сработало
 * - дошел пешкой до последней вертикали, открывается окно с выбором одной из четырех фигур
 * - премувы пока не делаем, только выбор клетки на пкм + комманд или ктрл и анулирование если просто по любому месту кроме фигуры нажать лкм
 * 
 */
