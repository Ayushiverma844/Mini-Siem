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
  const resultRef = useRef(null);

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
    for (
      let i = 0;
      i < terminalMessages.length;
      i++
    ) {

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            700
          )
      );

      setLogs(
        (prev) => [
          ...prev,
          terminalMessages[i],
        ]
      );
    }

    // =====================
    // SEND FILE TO BACKEND
    // =====================

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    const response =
      await fetch(
        "http://127.0.0.1:5000/upload-log-file",
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Server Error"
      );
    }

    console.log(data);

    // =====================
    // CREATE RESULT FORMAT
    // =====================

    const threatDetected =
      data.threats_detected > 0
        ? 1
        : 0;

    let severity =
      "Low";

    if (
      data.threats_detected >=
      5
    ) {
      severity =
        "Critical";
    } else if (
      data.threats_detected >=
      3
    ) {
      severity =
        "High";
    } else if (
      data.threats_detected >=
      1
    ) {
      severity =
        "Medium";
    }

    const confidence =
      (
        data.threats_detected /
        data.total_logs
      ).toFixed(2);

    const result = {
      attack_detected:
        threatDetected,
      severity:
        severity,
      confidence:
        Number(
          confidence
        ),
    };

    setPredictionResult(
      result
    );

    setLogs(
      (prev) => [
        ...prev,
        "[SUCCESS] Threat analysis completed",
      ]
    );

    // =====================
    // DASHBOARD UPDATE
    // =====================

    addScan({
      file:
        selectedFile.name,

      status:
        threatDetected ===
        1
          ? "Attack Detected"
          : "Safe",

      risk:
        severity,
    });

    setShowResult(
      true
    );

  } catch (error) {

    console.error(
      error
    );

    setLogs(
      (prev) => [
        ...prev,
        `[ERROR] ${error.message}`,
      ]
    );

    alert(
      error.message
    );

  } finally {

    setIsAnalyzing(
      false
    );
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
  // =====================
// AUTO SCROLL TO RESULT
// =====================
useEffect(() => {

  if (
    showResult &&
    resultRef.current
  ) {

    setTimeout(() => {

      resultRef.current
        .scrollIntoView({
          behavior:
            "smooth",

          block:
            "start",
        });

    }, 300);
  }

}, [showResult]);

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
            <h2 className="text-2xl font-semibold mb-8">
  Upload Log Evidence
</h2>

<div className="relative">

  {/* Upload Box */}
  <label
    className="
    w-full min-h-[300px]
    rounded-[32px]
    border-2 border-dashed
    border-cyan-500/20
    bg-[#020817]
    hover:border-cyan-400/40
    hover:bg-cyan-500/5
    transition-all duration-300
    cursor-pointer
    flex flex-col
    items-center
    justify-center
    px-10 py-12
    text-center
    group
  "
  >
    <input
      type="file"
      accept=".txt,.csv,.log"
      className="hidden"
      onChange={handleFileChange}
    />

    {/* Icon */}
    <div className="
      w-24 h-24
      rounded-[28px]
      bg-cyan-500/10
      border border-cyan-500/20
      flex items-center justify-center
      text-5xl
      mb-8
      group-hover:scale-110
      transition duration-300
    ">
      📂
    </div>

    {/* Heading */}
    <h3 className="text-2xl font-semibold text-cyan-300 mb-4">
      Upload Security Log File
    </h3>

    {/* Description */}
    <p className="text-gray-400 text-base leading-8 max-w-md">
      Click to upload your security logs
      here for
      intelligent SOC threat analysis
    </p>

 

    {/* Max Size */}
    <p className="text-gray-500 text-sm mt-8">
      Maximum file size: 10MB
    </p>
  </label>

  {/* Selected File */}
  {selectedFile && (
    <div className="
      mt-6
      bg-cyan-500/10
      border border-cyan-500/20
      rounded-[24px]
      p-5
      flex items-center justify-between
    ">

      <div>
        <p className="text-xs tracking-[3px] uppercase text-gray-400 mb-2">
          Active File
        </p>

        <p className="text-cyan-300 text-lg break-all">
          {selectedFile.name}
        </p>
      </div>

      <div className="
        w-16 h-16
        rounded-2xl
        bg-cyan-500/10
        flex items-center justify-center
        text-3xl
      ">
        📄
      </div>
    </div>
  )}
</div>

<button
  onClick={handleAnalyze}
  disabled={isAnalyzing}
  className="
  w-full mt-7 py-5
  rounded-[24px]
  bg-cyan-500
  text-black
  text-lg
  font-semibold
  hover:bg-cyan-400
  transition-all duration-300
  disabled:opacity-50
  disabled:cursor-not-allowed
"
>
  {isAnalyzing
    ? "Analyzing Security Logs..."
    : "Analyze Logs"}
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
          <div   ref={resultRef}
className="mt-10 bg-[#07101f]/90 rounded-[35px] p-8 border border-cyan-500/10">

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

            <div className="grid md:grid-cols-3 gap-5">

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
                 {predictionResult.severity}
                </h3>
              </div>
              <div className="bg-[#020817] p-6 rounded-2xl border border-cyan-500/10">
  <p className="text-gray-400 text-sm">
    Confidence Score
  </p>

  <h3 className="text-2xl mt-3 text-cyan-300">
    {Math.round(
      predictionResult.confidence *
      100
    )}%
  </h3>
</div>

            </div>
            {/* Security Recommendation */}
<div className="mt-8 bg-[#020817] border border-cyan-500/10 rounded-[30px] p-6">

  <div className="flex items-center gap-4 mb-5">

    <div className="
      w-14 h-14
      rounded-2xl
      bg-cyan-500/10
      border border-cyan-500/20
      flex items-center justify-center
      text-2xl
    ">
      🤖
    </div>

    <div>
      <h3 className="text-lg font-semibold text-cyan-300">
       Security Recommendation
      </h3>

    </div>
  </div>

  <p className="text-gray-300 leading-8">

    {predictionResult.severity ===
    "Critical"
      ? "Critical threat activity detected. Immediately isolate suspicious systems, block malicious traffic, rotate credentials, and investigate unauthorized access attempts."

      : predictionResult.severity ===
        "High"
      ? "High-risk behavior identified. Review authentication attempts, monitor network activity, and strengthen endpoint monitoring."

      : predictionResult.severity ===
        "Medium"
      ? "Potentially suspicious activity found. Continue monitoring and verify unusual login or access behavior."

      : "No major threat indicators detected. Continue monitoring and maintain updated security policies."}

  </p>
</div>
          </div>
          
        )}

        

      </div>
    </div>
    
    
  );
};

export default LogAnalysis;