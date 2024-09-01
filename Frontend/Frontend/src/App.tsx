import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import { RecoilRoot } from'recoil'
import Pages from './pages/Pages'

function App() {

  return (
   <>
   
   <RecoilRoot>
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pages" element={<Pages/>}/>
    </Routes>
   </BrowserRouter>
   </RecoilRoot>
   
   </>
  )
}

export default App
