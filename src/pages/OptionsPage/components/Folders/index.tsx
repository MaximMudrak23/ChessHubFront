import s from './styles.module.scss'
import Option from './components/Option'
import { useState } from 'react'

export default function Folders() {
    const OPTIONS = [
        {name: 'Board & Figures'},
        {name: 'Game Process'},
        {name: 'Profile'},
        {name: 'Account'},
        {name: 'Languages'},
        {name: 'Labs', imgURL:'/all/labs.svg'},
    ];
    const [selectedOption,setSelectedOption] = useState(0);

    return (
        <section className={s.folders}>
            {
                OPTIONS.map((option, index) => (
                    <Option
                        key={index}
                        name={option.name}
                        imgURL={option.imgURL}
                        isActive={selectedOption === index}
                        onClick={()=>setSelectedOption(index)}
                    />
                ))
            }
        </section>
    )
}