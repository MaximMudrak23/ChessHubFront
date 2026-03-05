import s from './styles.module.scss'
import Button from '../../../../components/UI/Button'

type Props = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PageSlider({currentPage, totalPages, setCurrentPage}: Props) {
    return (
        <div className={s.page_slider}>
            <Button
                icon={'/all/findLeft.svg'}
                variant={'transparent'}
                active={currentPage !== 1}
                onClick={()=>setCurrentPage(v => Math.max(1, v - 1))}
            />
            <span>{`Page ${currentPage}`}</span>
            <Button
                icon={'/all/findRight.svg'}
                variant={'transparent'}
                active={currentPage !== totalPages}
                onClick={()=>setCurrentPage(v => Math.min(totalPages, v + 1))}
            />
        </div>
    )
}