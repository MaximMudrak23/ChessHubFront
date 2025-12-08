import s from './styles.module.scss'
import { useRef, useState, useEffect } from 'react'

type Props = {
    description?: string;
}

export default function UserDescription({description='Description is empty...'}: Props) {
    const descriptionRef = useRef<HTMLDivElement|null>(null);
    const [isCutted, setIsCutted] = useState(false);

    useEffect(() => {
        const refElement = descriptionRef.current;
        if (!refElement) return;
        
        const calc = () => {setIsCutted(refElement.scrollHeight > refElement.clientHeight);}
        calc();

        const resizeObserver = new ResizeObserver(calc);
        resizeObserver.observe(refElement);
        return () => resizeObserver.disconnect();
    }, [description]);
    return (
        <>
            <div className={s.user_description} ref={descriptionRef}>
                <span>{description}</span>
            </div>
            {isCutted && <ViewMoreText />}
        </>
    )
}

function ViewMoreText() {
    return (
        <div className={s.view_more_text}>
            <span>View more info</span>
        </div>
    )
}