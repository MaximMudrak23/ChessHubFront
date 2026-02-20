import {Routes, Route} from 'react-router-dom'
import LayoutWithHeader from './components/LayoutWithHeader'

import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/MainPage'
import SearchPage from './pages/SearchPage'
import OptionsPage from './pages/OptionsPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import GamePage from './pages/GamePage'
import Page404 from './pages/Page404'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<WelcomePage />} />

        <Route element={<LayoutWithHeader />} >
          <Route path='/main' element={<MainPage />} />
          <Route path='/profile/:id' element={<ProfilePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/game/:id' element={<GamePage />} />
          <Route path='/options' element={<OptionsPage />} />
          <Route path='/admin' element={<AdminPage />} />
        </Route>
        
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App