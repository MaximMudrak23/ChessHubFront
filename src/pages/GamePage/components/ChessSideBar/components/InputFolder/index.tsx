import s from './styles.module.scss'

export default function InputFolder() {
    return (
        <form className={s.input_folder}> {/* this like i said upper in same component where button is */}
            <div className={s.input_folder_original}>
                <textarea name="" id=""></textarea> {/* add possibility to stretch by vertical this */}
                <button type='button'>
                    <img src="/all/emoji.svg" alt="" />
                </button>
                <button type='submit'>
                    <img src="/all/sendmessage.svg" alt="" />
                </button>
            </div>
        </form>
    )
}