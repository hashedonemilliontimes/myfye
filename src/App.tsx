import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.pcss";
import MobileApp from "./pages/mobileApp/MobileAppHome.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileApp />} />
      </Routes>
    </Router>
  );
}

export default App;
