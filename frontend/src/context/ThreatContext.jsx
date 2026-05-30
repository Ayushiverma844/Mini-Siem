// src/context/ThreatContext.jsx

import {
  createContext,
  useState,
    useEffect,
} from "react";


export const ThreatContext =
  createContext();

export const ThreatProvider = ({
  children,
}) => {

 const [scanHistory,
  setScanHistory] =
  useState(() => {

    const savedData =
      localStorage.getItem(
        "scanHistory"
      );

    return savedData
      ? JSON.parse(savedData)
      : [];
  });
  // ==========================
  // ADD NEW SCAN
  // ==========================

  const addScan = (
    scanData
  ) => {

    const newScan = {
      id: Date.now(),

      ...scanData,

      time:
        new Date().toLocaleTimeString(),
    };

    setScanHistory(
      (prev) => [
        newScan,
        ...prev,
      ]
    );
  };

  // ==========================
// RESET DASHBOARD
// ==========================

const resetDashboard = () => {
  setScanHistory([]);

  localStorage.removeItem(
    "scanHistory"
  );
};
  // =========================

  useEffect(() => {

  localStorage.setItem(
    "scanHistory",
    JSON.stringify(
      scanHistory
    )
  );

}, [scanHistory]);

  // ==========================
  // REAL STATISTICS
  // ==========================

  const totalScans =
    scanHistory.length;

  const threatsDetected =
    scanHistory.filter(
      (scan) =>
        scan.status ===
          "Phishing" ||
        scan.status ===
          "Attack Detected"
    ).length;

  const safeFiles =
    scanHistory.filter(
      (scan) =>
        scan.status ===
        "Safe"
    ).length;

  const criticalAlerts =
    scanHistory.filter(
      (scan) =>
        scan.risk ===
        "Critical"
    ).length;

  // ==========================
  // REAL THREAT DISTRIBUTION
  // ==========================

const severityCount = {
  Critical: 0,
  High: 0,
  Medium: 0,
  Low: 0,
};

scanHistory.forEach(
  (scan) => {

    const risk =
      scan.risk
        ?.toLowerCase();

    if (
      risk ===
      "critical"
    ) {
      severityCount
        .Critical++;
    }

    else if (
      risk ===
      "high"
    ) {
      severityCount
        .High++;
    }

    else if (
      risk ===
      "medium"
    ) {
      severityCount
        .Medium++;
    }

    else if (
      risk ===
      "low"
    ) {
      severityCount
        .Low++;
    }
  }
);

  return (
    <ThreatContext.Provider
      value={{
  scanHistory,

  addScan,
  resetDashboard,

  totalScans,
  threatsDetected,
  safeFiles,
  criticalAlerts,

  severityCount,
}}
    >
      {children}
    </ThreatContext.Provider>
  );
};