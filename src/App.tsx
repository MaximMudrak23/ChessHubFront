import {Routes, Route} from 'react-router-dom'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import LayoutWithHeader from './components/LayoutWithHeader'
import MatchmakingWatcher from './components/MatchmakingWatcher'
import AppBackground from './components/AppBackground'
import ActiveGameLoader from './components/ActiveGameLoader'
import AuthLoader from './components/AuthLoader'

import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/MainPage'
import SearchPage from './pages/SearchPage'
import OptionsPage from './pages/OptionsPage'
import ProfilePage from './pages/ProfilePage'
import ProfileEdit from './pages/ProfileEdit'
import AdminPage from './pages/AdminPage'
import GamePage from './pages/GamePage'
import WhatIsChessHubPage from './pages/WhatIsChessHubPage'
import Page404 from './pages/Page404'

function App() {
  return (
    <>
      <AuthLoader />
      <ActiveGameLoader />
      <AppBackground />
      <MatchmakingWatcher />

      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/what-is-chesshub' element={<WhatIsChessHubPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutWithHeader />} >
            <Route path='/main' element={<MainPage />} />
            <Route path='/profile/:id' element={<ProfilePage />} />
            <Route path='/profile/:id/edit' element={<ProfileEdit />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/game/:id' element={<GamePage />} />
            <Route path='/options' element={<OptionsPage />} />
            
            <Route element={<AdminRoute />}>
              <Route path='/admin' element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App