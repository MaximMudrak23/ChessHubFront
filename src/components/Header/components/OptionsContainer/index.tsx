import s from './styles.module.scss'

type Props = {
    className: string;
    children?: React.ReactNode;
}

export default function OptionsContainer({className, children}: Props) {
    return (
        <section className={className}>
            {children}
        </section>
    )
}