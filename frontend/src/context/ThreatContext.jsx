// src/context/ThreatContext.jsx

import { createContext, useState } from "react";

export const ThreatContext =
  createContext();

export const ThreatProvider = ({
  children,
}) => {
  const [scanHistory, setScanHistory] =
    useState([]);

  // Add new scan
  const addScan = (scanData) => {
    setScanHistory((prev) => [
      {
        ...scanData,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

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
        scan.status === "Safe"
    ).length;

  const criticalAlerts =
    scanHistory.filter(
      (scan) =>
        scan.risk ===
        "Critical"
    ).length;

  // ==========================
  // REAL THREAT LEVELS
  // ==========================

  const severityCount = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
  };

  scanHistory.forEach((scan) => {
    if (
      severityCount[scan.risk] !==
      undefined
    ) {
      severityCount[
        scan.risk
      ]++;
    }
  });

  return (
    <ThreatContext.Provider
      value={{
        scanHistory,
        addScan,

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