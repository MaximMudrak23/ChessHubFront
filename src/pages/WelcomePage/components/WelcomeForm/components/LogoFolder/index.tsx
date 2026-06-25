import s from './styles.module.scss'
import Button from '@/components/UI/Button'
import { LOGO } from '@/constants/paths'
import { SVG } from '@/constants/paths'
import { useNavigate } from 'react-router-dom'


export default function LogoFolder() {
    const navigate = useNavigate();

    return (
        <div className={s.logo_folder}>
            <div className={s.logo}>
                <img src={LOGO.newLogo} alt="ChessHub Logo" draggable={false} />
                <span>CHESSHUB</span>
            </div>

            <Button
                text='What is ChessHub?'
                icon={SVG.externalLink}
                variant='aura'
                styleProps={{
                    padding: '12px',
                }}
                onClick={()=>navigate('/what-is-chesshub')}
            />
        </div>
    )
}