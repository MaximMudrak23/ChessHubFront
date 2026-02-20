import SteamContentWrapper from '../../components/SteamContentWrapper'
import Button from '../../components/UI/Button'

export default function MainPage() {
    return (
        <>
            <SteamContentWrapper>
                <p style={{textAlign: 'center', paddingTop: '48px', fontSize: '1.2rem'}}>Unfortunately, I haven't figured out what to put on this page yet, so it's empty for now. 😢</p>
            </SteamContentWrapper>
            <Button
                text='Find Game'

                variant='green'
                animation='main'
                adaptiveMode='floating'

                onClick={()=>''}
            />
        </>
    )
}