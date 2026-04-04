import s from './styles.module.scss'
import Option from '../../../../components/UI/Option';

type Props = {
    selectedFolder: number;
    setSelectedFolder: React.Dispatch<React.SetStateAction<number>>;
}

const OPTIONS = [
    {name: 'Board & Figures'},
    {name: 'Game Process'},
    {name: 'Profile'},
    {name: 'Account'},
    {name: 'Languages'},
    {name: 'Labs', imgURL:'/all/labs.svg'},
];

export default function OptionsContainer({selectedFolder, setSelectedFolder}: Props) {
    return (
        <section className={s.options_container}>
            {
                OPTIONS.map((option, index) => (
                    <Option
                        key={option.name}
                        name={option.name}
                        imgURL={option.imgURL}
                        isActive={selectedFolder === index}
                        isGlow
                        fontSize={'high'}
                        lineAxis={'vertical'}
                        onClick={()=>setSelectedFolder(index)}
                    />
                ))
            }
        </section>
    )
}