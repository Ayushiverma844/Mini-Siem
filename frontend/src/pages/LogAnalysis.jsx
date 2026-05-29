import { useState, useEffect, useRef,  useContext } from "react";
import {
  ThreatContext,
} from "../context/ThreatContext";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";

const LogAnalysis = () => {
  const { addScan } =
    useContext(
      ThreatContext
    );
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [showResult, setShowResult] =
    useState(false);
  const [predictionResult,
  setPredictionResult] =
  useState(null);
  const [logs, setLogs] = useState([]);

  const [result, setResult] =
    useState(null);

  const terminalRef = useRef(null);

  // Form Inputs
  const [formData, setFormData] =
    useState({
      network_packet_size: "",
      protocol_type: "TCP",
      login_attempts: "",
      session_duration: "",
      encryption_used: "AES",
      ip_reputation_score: "",
      failed_logins: "",
      browser_type: "Chrome",
      unusual_time_access: 0,
    });

  // Allowed log files
  const allowedLogExtensions = [
    ".log",
    ".txt",
    ".csv",
  ];

  const allowedLogMimeTypes = [
    "text/plain",
    "text/csv",
    "application/csv",
  ];

  const terminalMessages = [
    "[SYSTEM] Initializing SOC engine...",
    "[SCAN] Parsing security metadata...",
    "[SCAN] Analyzing login behavior...",
    "[SCAN] Checking network packet anomalies...",
    "[SCAN] Running ML threat model...",
    "[SCAN] Correlating suspicious indicators...",
    "[FINAL] Threat intelligence generated..."
  ];

  const handleInputChange = (e) => {
    const { name, value } =
      e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // File Upload Validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    const isValidExtension =
      allowedLogExtensions.includes(
        extension
      );

    const isValidMime =
      allowedLogMimeTypes.includes(
        file.type
      ) || file.type === "";

    const isValidSize =
      file.size <= 10 * 1024 * 1024;

    if (
      !isValidExtension ||
      !isValidMime
    ) {
      alert(
        "Only .log, .txt, .csv files are allowed"
      );

      e.target.value = "";
      return;
    }

    if (!isValidSize) {
      alert(
        "File size must be under 10MB"
      );

      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Analyze Logs
  const handleAnalyze =
  async () => {

  if (!selectedFile) {
    alert(
      "Please upload log file"
    );
    return;
  }

  setIsAnalyzing(true);
  setShowResult(false);

  try {
    // Read file text
    const fileContent =
      await selectedFile.text();

    /*
      Expected CSV format:
      network_packet_size,
      protocol_type,
      login_attempts,
      session_duration,
      encryption_used,
      ip_reputation_score,
      failed_logins,
      browser_type,
      unusual_time_access
    */

    const lines =
      fileContent
        .trim()
        .split("\n");

    const values =
      lines[1]
        .split(",");

    const payload = {
      network_packet_size:
        Number(values[0]),

      protocol_type:
        values[1],

      login_attempts:
        Number(values[2]),

      session_duration:
        Number(values[3]),

      encryption_used:
        values[4],

      ip_reputation_score:
        Number(values[5]),

      failed_logins:
        Number(values[6]),

      browser_type:
        values[7],

      unusual_time_access:
        Number(values[8]),
    };

    // Backend API call
    const response =
      await fetch(
        "http://127.0.0.1:5000/predict-log",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

    const result =
      await response.json();

    setPredictionResult(
      result
    );

    // =====================
    // Dashboard Update
    // =====================

    addScan({
      file:
        selectedFile.name,

      status:
        result.attack_detected ===
        1
          ? "Attack Detected"
          : "Safe",

      risk:
        result.attack_detected ===
        1
          ? "Critical"
          : "Low",
    });

    setShowResult(true);
  } catch (error) {
    console.error(error);

    alert(
      "Backend connection failed"
    );
  } finally {
    setIsAnalyzing(false);
  }
};

  // Auto Scroll Terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#020817] text-white relative overflow-hidden">

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 px-8">
        <NavigationBar />

        {/* Heading */}
        <div className="mt-14">
          <p className="uppercase tracking-[5px] text-cyan-400 text-sm mb-5">
            Security Operations Center
          </p>

          <h1 className="text-6xl font-bold">
            Security Log Analysis
          </h1>

          <p className="text-gray-400 mt-5 max-w-3xl leading-8">
            Upload logs and analyze
            suspicious security behavior
            using AI-powered threat
            intelligence.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-2 gap-7 mt-14">

          {/* LEFT PANEL */}
          <div className="bg-[#07101f]/90 rounded-[30px] p-6 border border-cyan-500/10">

            <h2 className="text-2xl font-semibold mb-6">
              Threat Parameters
            </h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className="px-5 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 cursor-pointer hover:bg-cyan-500/20">
                Upload Evidence File

                <input
                  type="file"
                  accept=".txt,.csv,.log"
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                />
              </label>

              {selectedFile && (
                <p className="mt-3 text-cyan-300">
                  ACTIVE_FILE:
                  <span className="text-white ml-2">
                    {
                      selectedFile.name
                    }
                  </span>
                </p>
              )}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">

              <input
                type="number"
                name="network_packet_size"
                placeholder="Packet Size"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              />

              <select
                name="protocol_type"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              >
                <option>
                  TCP
                </option>
                <option>
                  UDP
                </option>
              </select>

              <input
                type="number"
                name="login_attempts"
                placeholder="Login Attempts"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              />

              <input
                type="number"
                name="failed_logins"
                placeholder="Failed Logins"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              />

              <input
                type="number"
                name="session_duration"
                placeholder="Session Duration"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              />

              <input
                type="number"
                name="ip_reputation_score"
                placeholder="IP Reputation"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              />

              <select
                name="encryption_used"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              >
                <option>
                  AES
                </option>
                <option>
                  RSA
                </option>
              </select>

              <select
                name="browser_type"
                onChange={
                  handleInputChange
                }
                className="bg-[#020817] border border-cyan-500/10 rounded-xl p-4"
              >
                <option>
                  Chrome
                </option>
                <option>
                  Firefox
                </option>
                <option>
                  Edge
                </option>
              </select>
            </div>

            {/* Toggle */}
            <div className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unusual_time_access:
                      e.target.checked
                        ? 1
                        : 0,
                  })
                }
              />

              <p>
                Unusual Time Access
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              className="w-full mt-6 py-4 rounded-2xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
            >
              Analyze Logs
            </button>
          </div>

          {/* RIGHT PANEL TERMINAL */}
          <div className="bg-black border border-cyan-500/20 rounded-[30px] p-6 font-mono">

            <h2 className="text-cyan-300 text-xl mb-4">
              SOC_TERMINAL
            </h2>

            <div
              ref={terminalRef}
              className="h-[450px] overflow-y-auto space-y-2 text-sm"
            >
              {!isAnalyzing &&
                logs.length === 0 && (
                  <p className="text-gray-500">
                    waiting_for_input...
                  </p>
                )}

              {logs.map(
                (log, index) => (
                  <p
                    key={index}
                    className="text-green-400"
                  >
                    {log}
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        {/* RESULT PANEL */}
        {showResult &&
  predictionResult && (
    <div className="mt-10 bg-[#07101f]/90 rounded-[35px] p-8 border border-cyan-500/10">

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          Security Analysis
          Result
        </h2>

        <div
          className={`px-5 py-2 rounded-full border ${
            predictionResult.attack_detected ===
            1
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-green-500/10 border-green-500/20 text-green-300"
          }`}
        >
          {predictionResult.attack_detected ===
          1
            ? "Threat Detected"
            : "System Safe"}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* Detection */}
        <div className="bg-[#020817] rounded-[25px] p-6 border border-cyan-500/10">
          <p className="text-gray-400 text-sm">
            Attack Status
          </p>

          <h3 className="text-2xl font-semibold mt-3">
            {predictionResult.attack_detected ===
            1
              ? "Attack Detected"
              : "Safe"}
          </h3>
        </div>

        {/* Severity */}
        <div className="bg-[#020817] rounded-[25px] p-6 border border-cyan-500/10">
          <p className="text-gray-400 text-sm">
            Risk Level
          </p>

          <h3 className="text-2xl font-semibold mt-3 text-cyan-300">
            {predictionResult.attack_detected ===
            1
              ? "Critical"
              : "Low"}
          </h3>
        </div>
      </div>
    </div>
)}
      </div>
    </div>
  );
};

export default LogAnalysis;