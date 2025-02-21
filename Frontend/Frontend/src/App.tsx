import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import { RecoilRoot } from "recoil";
import Pages from "./pages/Pages";
import { Toaster } from "./components/ui/toaster";
import UrlPage from "./pages/UrlPage";
import MyUrls from "./pages/MyUrls";

function App() {
  return (
    <>
      <RecoilRoot>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/myurls" element={<MyUrls />} />
            <Route path="/pg/:id" element={<UrlPage />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
