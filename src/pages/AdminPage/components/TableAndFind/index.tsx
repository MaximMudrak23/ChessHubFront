import s from './styles.module.scss'
import FindFolder from './components/FindFolder'
import Table from './components/Table'

export default function TableAndFind() {
    return (
        <div className={s.table_and_find}>
            <FindFolder />
            <div className={s.table_wrap}>
                <Table />
            </div>
        </div>
    )
}