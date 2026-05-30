import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import EmailAnalysis from "./pages/EmailAnalysis";
import LogAnalysis from "./pages/LogAnalysis";

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/email-analysis" element={<EmailAnalysis />} />
        <Route path="/log-analysis" element={<LogAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;