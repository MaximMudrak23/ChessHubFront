import {Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage'
import GamePage from './pages/GamePage'
import Page404 from './pages/Page404'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/profile/:id' element={<ProfilePage />} />
        <Route path='/game/:id' element={<GamePage />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App