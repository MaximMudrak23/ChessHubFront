import {Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/MainPage'
import FindPage from './pages/FindPage'
import OptionsPage from './pages/OptionsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import GamePage from './pages/GamePage'
import Page404 from './pages/Page404'

// FIX IT, HEADER CANT BE ON WELCOMEPAGE !!!

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/profile/:id' element={<ProfilePage />} />
        <Route path='/game/:id' element={<GamePage />} />
        <Route path='/find' element={<FindPage />} />
        <Route path='/options' element={<OptionsPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App