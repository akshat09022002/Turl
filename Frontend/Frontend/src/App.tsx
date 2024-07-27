import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import { RecoilRoot } from'recoil'

function App() {

  return (
   <>
   
   <RecoilRoot>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
   </BrowserRouter>
   </RecoilRoot>
   
   </>
  )
}

export default App
