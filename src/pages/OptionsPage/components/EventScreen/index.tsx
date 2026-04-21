import s from './styles.module.scss'
import BoardAndFigures from './components/BoardAndFigures';

interface ConfigFolder {
    title: string;
    description: string;
    Component?: React.ElementType;
}

const FOLDERS: Record<number, ConfigFolder> = {
//   0: {
//     title: 'Board & Figures',
//     description: 'How will your chess look like?',
//     Component: BoardAndFigures,
//   },
//   1: {
//     title: 'Game Process',
//     description: 'In good hands very useful things',
//   },
};

export default function EventScreen({selectedFolder}: {selectedFolder: number}) {
    const config = FOLDERS[selectedFolder];
    if (!config) return <p className={s.error}>This option in development ⚙️</p>

    return (
        <section className={s.event_screen}>
            <div className={s.title}>
                <h1>{config.title}</h1>
                <p className={s.description}>{config.description}</p>
            </div>
            
            {config.Component && <config.Component />}
        </section>
    )
}