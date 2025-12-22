import s from './styles.module.scss'

type Props = {
    className: string;
    children: React.ReactNode;
}

export default function OptionsContainer({className, children}: Props) {
    const classes = [s.optionsContainer, className].filter(Boolean).join(' ');
    return (
        <section className={classes}>
            {children}
        </section>
    )
}