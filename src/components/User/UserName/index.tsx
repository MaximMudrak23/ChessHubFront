import s from './styles.module.scss'
import clsx from 'clsx'
import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
    userName: string;
    variation: 'profile' | 'card';
    Icons?: string[];
    className?: string;
    styleProps?: React.CSSProperties;
}

export default function UserName(props: Props) {
    const rootRef = useRef<HTMLDivElement>(null)
    const nameRef = useRef<HTMLSpanElement>(null)
    const [visibleIconsCount, setVisibleIconsCount] = useState(props.Icons?.length ?? 0)

    useLayoutEffect(() => {
        const updateVisibleIcons = () => {
            const root = rootRef.current
            const name = nameRef.current
            const icons = props.Icons ?? []

            if (!root || !name || icons.length === 0) {
                setVisibleIconsCount(0)
                return
            }

            const rootWidth = root.clientWidth
            const nameWidth = name.scrollWidth

            const rootStyles = window.getComputedStyle(root)
            const gap = parseFloat(rootStyles.columnGap || rootStyles.gap || '0')

            const iconWidth = props.variation === 'profile' ? 25.6 : 25.6

            let nextVisibleCount = 0

            for (let count = icons.length; count >= 0; count--) {
                const iconsWidth = count * iconWidth
                const gapsWidth = count > 0 ? gap * count : 0
                const totalNeed = nameWidth + iconsWidth + gapsWidth

                if (totalNeed <= rootWidth) {
                    nextVisibleCount = count
                    break
                }
            }

            setVisibleIconsCount(nextVisibleCount)
        }

        updateVisibleIcons()

        const resizeObserver = new ResizeObserver(updateVisibleIcons)

        if (rootRef.current) resizeObserver.observe(rootRef.current)
        if (nameRef.current) resizeObserver.observe(nameRef.current)

        window.addEventListener('resize', updateVisibleIcons)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', updateVisibleIcons)
        }
    }, [props.userName, props.Icons, props.variation])

    return (
        <div
            ref={rootRef}
            className={clsx(s.userName, props.className)}
            style={props.styleProps}
        >
            <span
                ref={nameRef}
                className={clsx(s[`userName--${props.variation}`])}
            >
                {props.userName}
            </span>

            {props.Icons?.slice(0, visibleIconsCount).map((icon, i) => (
                <img key={i} src={icon} alt="" />
            ))}
        </div>
    )
}