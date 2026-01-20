import s from './styles.module.scss'

export default function Moves() {
    const arrTest = new Array(4).fill('z');
    
    return (
        <>
            {arrTest.map((_, i) => 
                <div className={s.moves_table_test} key={i}>
                    <p className={s.move_number}>{i+1}</p>

                    <div className={s.move_white}>
                        <img src="/all/horse_moves.svg" alt="test" />
                        <span>c4</span>
                    </div>

                    <div className={s.move_black}>
                        <img src="/all/horse_moves.svg" alt="test" />
                        <span>b1</span>
                    </div>
                </div>
            )}
        </>
    )
}
