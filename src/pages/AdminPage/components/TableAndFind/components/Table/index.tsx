import s from './styles.module.scss'

export default function Table() {
    const USERS = [
        {
            id: 1,
            name: 'Mobik',
            login: 'zxczxc',
            mail: 'zxcmobik@gmail.com',
            role: ['user', 'admin'],
            createdAt: '12.02.2026',
            lastSeen: '12.02.2026',
            isBanned: false,
        },
        {
            id: 2,
            name: 'Mobik',
            login: 'zxczxc',
            mail: 'zxcmobik@gmail.com',
            role: ['user', 'admin'],
            createdAt: '12.02.2026',
            lastSeen: '12.02.2026',
            isBanned: false,
        },
    ]

    return (
        <table className={s.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Login</th>
                    <th>Mail</th>
                    <th>Role</th>
                    <th>CreatedAt</th>
                    <th>LastSeen</th>
                    <th>IsBanned</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {USERS.map(user => (
                    <tr>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.login}</td>
                        <td>{user.mail}</td>
                        <td>{user.role}</td>
                        <td>{user.createdAt}</td>
                        <td>{user.lastSeen}</td>
                        <td>{user.isBanned.toString()}</td>
                        <td><img src="/all/more.svg" alt="More" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}