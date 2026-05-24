import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import DashboardOverview from "./pages/DashboardOverview";
import EmailSecurity from "./pages/EmailSecurity";
import LogMonitoring from "./pages/LogMonitoring";
import ThreatAnalytics from "./pages/ThreatAnalytics";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="email-security" element={<EmailSecurity />} />
          <Route path="log-monitoring" element={<LogMonitoring />} />
          <Route path="threat-analytics" element={<ThreatAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;