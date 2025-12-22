type Props = {
    options: string[];
    placeholder?: boolean;
    placeholderValue?: string;
    styles?: React.CSSProperties;
}

export default function Select({options, placeholder=false, placeholderValue, styles}: Props) {
    return (
        <select style={styles}>
            {
            placeholder && <option disabled selected hidden>{placeholderValue}</option>
            }

            {
                options.map((x,i) => <option key={i} value={x}>{x}</option>)
            }
        </select>
    )
}