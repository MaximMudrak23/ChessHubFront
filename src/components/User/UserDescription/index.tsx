export default function UserDescription({text, className}: {text?: string, className?: string}) {
    return (
        <div className={className}>
            <p>{text ? text : 'No information given'}</p>
        </div>
    )
}