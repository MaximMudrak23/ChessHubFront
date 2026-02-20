import s from './styles.module.scss'
import Header from '../Header'
import { Outlet } from 'react-router-dom'

export default function LayoutWithHeader() {
    return (
        <>
            <Header />
            <main className={s.layoutWithHeader}>
                <Outlet />
            </main>
        </>
    )
}