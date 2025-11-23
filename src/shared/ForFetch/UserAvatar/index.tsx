type Props = {
    username: string;
}

export default function UserAvatar({username}: Props) {
    return <img src="./recront.jpg" alt={`${username} Avatar`} draggable={false} />
}