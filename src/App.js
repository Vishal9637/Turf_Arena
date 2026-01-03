import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./Pages/Home.jsx";
import TurfList from "./Pages/TurfList.jsx";
import TurfDetails from "./Pages/TurfDetails.jsx";
import TopRatedTurfs from "./Pages/TopRatedTurfs.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/turfs" element={<TurfList />} />
          <Route path="/turf/:id" element={<TurfDetails />} />
          <Route path="/top-rated" element={<TopRatedTurfs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
