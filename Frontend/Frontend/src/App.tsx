import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import { RecoilRoot, useRecoilState } from "recoil";
import Pages from "./pages/Pages";
import Test from "./pages/Test";
import { Toaster } from "./components/ui/toaster";
import { isSignedIn } from "./store/atoms/atom";
import { useEffect } from "react";


function App() {

  return (
    <>
      <RecoilRoot>
        <Toaster/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/test" element={<Test/>}/>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
