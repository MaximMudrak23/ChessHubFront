import {Routes, Route} from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import Page404 from './pages/Page404'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <>
     <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/profile/:id' element={<ProfilePage />} />
        <Route path='*' element={<Page404 />} />
     </Routes>
    </>
  )
}

export default App