import {Routes, Route, Navigate} from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import MainPage from './pages/MainPage'
import Page404 from './pages/Page404'

function App() {
  return (
    <>
     <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='*' element={<Page404 />} />
        {/* <Route path='*' element={<Navigate to={'/'} replace />} /> */}
     </Routes>
    </>
  )
}

export default App