import {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";

import { ThreatContext } from "../context/ThreatContext";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";

const LogAnalysis = () => {
  const { addScan } = useContext(ThreatContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const terminalRef = useRef(null);

  // =====================
  // TERMINAL STEPS
  // =====================
  const terminalMessages = [
    "[SYSTEM] Initializing SOC engine...",
    "[SCAN] Parsing security metadata...",
    "[SCAN] Analyzing login behavior...",
    "[SCAN] Checking network packet anomalies...",
    "[SCAN] Running ML threat model...",
    "[SCAN] Correlating suspicious indicators...",
    "[FINAL] Generating threat report...",
  ];

  // =====================
  // FILE VALIDATION
  // =====================
  const allowedLogExtensions = [".log", ".txt", ".csv"];
  const allowedLogMimeTypes = [
    "text/plain",
    "text/csv",
    "application/csv",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = "." + file.name.split(".").pop().toLowerCase();

    const isValid =
      allowedLogExtensions.includes(extension) &&
      (allowedLogMimeTypes.includes(file.type) || file.type === "");

    const isValidSize = file.size <= 10 * 1024 * 1024;

    if (!isValid) {
      alert("Only .log, .txt, .csv files allowed");
      e.target.value = "";
      return;
    }

    if (!isValidSize) {
      alert("File must be under 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // =====================
  // ANALYZE LOG FILE
  // =====================
  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload log file");
      return;
    }

    setIsAnalyzing(true);
    setShowResult(false);
    setLogs([]);
    setPredictionResult(null);

    try {
      // =====================
      // TERMINAL ANIMATION
      // =====================
      for (let i = 0; i < terminalMessages.length; i++) {
        await new Promise((r) => setTimeout(r, 700));

        setLogs((prev) => [...prev, terminalMessages[i]]);
      }

      // =====================
      // READ FILE (CSV)
      // =====================
      const fileContent = await selectedFile.text();
      const lines = fileContent.trim().split("\n");
      const values = lines[1].split(",");

      const payload = {
        network_packet_size: Number(values[0]),
        protocol_type: values[1],
        login_attempts: Number(values[2]),
        session_duration: Number(values[3]),
        encryption_used: values[4],
        ip_reputation_score: Number(values[5]),
        failed_logins: Number(values[6]),
        browser_type: values[7],
        unusual_time_access: Number(values[8]),
      };

      // =====================
      // ML BACKEND CALL
      // =====================
      const response = await axios.post(
        "http://127.0.0.1:5000/predict-log",
        payload
      );

      const result = response.data;
      setPredictionResult(result);

      // success log
      setLogs((prev) => [
        ...prev,
        "[SUCCESS] Threat analysis completed",
      ]);

      // =====================
      // DASHBOARD UPDATE
      // =====================
      addScan({
        file: selectedFile.name,
        status:
          result.attack_detected === 1
            ? "Attack Detected"
            : "Safe",
        risk:
          result.attack_detected === 1
            ? "Critical"
            : "Low",
      });

      setShowResult(true);
    } catch (error) {
      console.error(error);

      setLogs((prev) => [
        ...prev,
        "[ERROR] Backend connection failed",
      ]);

      alert("Backend connection failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // =====================
  // AUTO SCROLL TERMINAL
  // =====================
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop =
        terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#020817] text-white relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />

      <div className="relative z-10 px-8">

        <NavigationBar />

        {/* HEADER */}
        <div className="mt-14">
          <p className="uppercase tracking-[5px] text-cyan-400 text-sm mb-5">
            Security Operations Center
          </p>

          <h1 className="text-6xl font-bold">
            Security Log Analysis
          </h1>

          <p className="text-gray-400 mt-5 max-w-3xl leading-8">
            Upload log file and analyze system behavior using ML-based threat detection engine.
          </p>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-2 gap-7 mt-14">

          {/* LEFT */}
          <div className="bg-[#07101f]/90 rounded-[30px] p-6 border border-cyan-500/10">

            <h2 className="text-2xl font-semibold mb-6">
              Upload Log Evidence
            </h2>

            <label className="px-5 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 cursor-pointer">
              Upload File
              <input
                type="file"
                accept=".txt,.csv,.log"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <p className="mt-3 text-cyan-300">
                ACTIVE_FILE:
                <span className="text-white ml-2">
                  {selectedFile.name}
                </span>
              </p>
            )}

            <button
              onClick={handleAnalyze}
              className="w-full mt-6 py-4 rounded-2xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
            >
              Analyze Logs
            </button>
          </div>

          {/* RIGHT TERMINAL */}
          <div className="bg-black border border-cyan-500/20 rounded-[30px] p-6 font-mono">

            <h2 className="text-cyan-300 text-xl mb-4">
              SOC TERMINAL
            </h2>

            <div
              ref={terminalRef}
              className="h-[420px] overflow-y-auto text-sm space-y-2"
            >
              {!isAnalyzing && logs.length === 0 && (
                <p className="text-gray-500">
                  waiting_for_input...
                </p>
              )}

              {logs.map((log, i) => (
                <p
                  key={i}
                  className={`${
                    log.includes("[ERROR]")
                      ? "text-red-400"
                      : log.includes("[SUCCESS]")
                      ? "text-cyan-300"
                      : "text-green-400"
                  }`}
                >
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* RESULT */}
        {showResult && predictionResult && (
          <div className="mt-10 bg-[#07101f]/90 rounded-[35px] p-8 border border-cyan-500/10">

            <div className="flex justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Security Analysis Result
              </h2>

              <div className={`px-5 py-2 rounded-full border ${
                predictionResult.attack_detected === 1
                  ? "bg-red-500/10 border-red-500/20 text-red-300"
                  : "bg-green-500/10 border-green-500/20 text-green-300"
              }`}>
                {predictionResult.attack_detected === 1
                  ? "Threat Detected"
                  : "System Safe"}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div className="bg-[#020817] p-6 rounded-2xl border border-cyan-500/10">
                <p className="text-gray-400 text-sm">Status</p>
                <h3 className="text-2xl mt-3">
                  {predictionResult.attack_detected === 1
                    ? "Attack Detected"
                    : "Safe"}
                </h3>
              </div>

              <div className="bg-[#020817] p-6 rounded-2xl border border-cyan-500/10">
                <p className="text-gray-400 text-sm">Risk Level</p>
                <h3 className="text-2xl mt-3 text-cyan-300">
                  {predictionResult.attack_detected === 1
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