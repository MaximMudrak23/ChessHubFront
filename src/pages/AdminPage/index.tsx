import s from './styles.module.scss'
import SidePannel from './components/SidePannel'
import TableAndFind from './components/TableAndFind'

export default function AdminPage() {
    return (
        <section className={s.admin_page}>
            <SidePannel />
            <TableAndFind />
        </section>
    )
}