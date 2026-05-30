import {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";

import {
  ThreatContext,
} from "../context/ThreatContext";
import NavigationBar from "../components/NavigationBar";
import axios from "axios";

const EmailAnalysis = () => {
  const { addScan } = useContext(ThreatContext);
  const [scanTime, setScanTime] =
  useState("");
  const [emailText, setEmailText] = useState("");
  const [emailFile, setEmailFile] = useState(null);

  const [showResult, setShowResult] = useState(false);
  const [predictionResult,setPredictionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [logs, setLogs] = useState([]);
  const terminalRef = useRef(null);
  const resultRef = useRef(null);

  // prediction result from ML model
  const [result, setResult] = useState(null);

  const allowedEmailExtensions = [".txt", ".eml"];
  const allowedEmailMimeTypes = [
    "text/plain",
    "message/rfc822",
  ];

  const terminalMessages = [
    "[SYSTEM] Initializing email forensic engine...",
    "[SCAN] Extracting email content...",
    "[SCAN] Running phishing classification model...",
    "[SCAN] Detecting malicious patterns...",
    "[SCAN] Threat intelligence matching...",
    "[FINAL] Generating security report..."
  ];

  // File Upload
  const handleEmailFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const extension =
      "." +
      file.name.split(".").pop().toLowerCase();

    const isValidExtension =
      allowedEmailExtensions.includes(extension);

    const isValidMime =
      allowedEmailMimeTypes.includes(file.type) ||
      file.type === "";

    const isValidSize =
      file.size <= 5 * 1024 * 1024;

    if (!isValidExtension || !isValidMime) {
      alert(
        "Only .txt and .eml files are allowed"
      );
      e.target.value = "";
      return;
    }

    if (!isValidSize) {
      alert(
        "File size must be under 5MB"
      );
      e.target.value = "";
      return;
    }

    setEmailFile(file);

    // Read file content
    const text = await file.text();
    setEmailText(text);
  };

  // Analyze
const handleAnalyze = async () => {

  if (
    !emailText.trim() &&
    !emailFile
  ) {
    alert(
      "Please enter email content or upload file"
    );
    return;
  }

  setIsAnalyzing(true);
  setShowResult(false);
  setLogs([]);

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
          setTimeout(resolve, 700)
      );

      setLogs((prev) => [
        ...prev,
        terminalMessages[i],
      ]);
    }

    let finalText = emailText;

    // uploaded file read
    if (emailFile) {
      finalText =
        await emailFile.text();
    }

    // =====================
    // ML BACKEND CALL
    // =====================

    const response =
      await axios.post(
        "http://127.0.0.1:5000/predict-phishing",
        {
          email_text:
            finalText,
        }
      );

    const result =
      response.data;
    const now = new Date();

const formattedTime =
  now.toLocaleDateString(
    "en-GB"
  ) +
  " | " +
  now.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

setScanTime(
  formattedTime
);
    setPredictionResult(
      result
    );

    // terminal success log
    setLogs((prev) => [
      ...prev,
      `[SUCCESS] Threat analysis completed`,
    ]);

    // =====================
    // DASHBOARD UPDATE
    // =====================

    addScan({
      file:
        emailFile?.name ||
        "email_text",

      status:
        result.phishing_detected ===
        1
          ? "Phishing"
          : "Safe",

      risk:
        result.severity,
    });

    setShowResult(true);

  } catch (error) {

    console.error(error);

    setLogs((prev) => [
      ...prev,
      `[ERROR] Backend connection failed`,
    ]);

    alert(
      "Backend connection failed"
    );

  } finally {
    setIsAnalyzing(false);
  }
};
  // auto scroll terminal
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
          behavior: "smooth",
          block: "start",
        });

    }, 300);
  }

}, [showResult]);

  return (
    <div className="min-h-screen bg-[#020817] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 px-8">
        <NavigationBar />

        {/* Header */}
        <div className="mt-14">
          <p className="uppercase tracking-[5px] text-cyan-400 text-sm mb-5">
            Threat Analysis Workspace
          </p>

          <h1 className="text-6xl font-bold">
            Email Threat Intelligence
          </h1>

          <p className="text-gray-400 mt-5 max-w-3xl leading-8">
            Upload secure email files or
            paste suspicious email content.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-7 mt-14">
          
          {/* Input */}
          <div className="bg-[#07101f]/90 border border-cyan-500/10 rounded-[30px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Input Terminal
              </h2>

              <label className="px-5 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 cursor-pointer hover:bg-cyan-500/20">
                Upload File

                <input
                  type="file"
                  accept=".txt,.eml"
                  className="hidden"
                  onChange={
                    handleEmailFileChange
                  }
                />
              </label>
            </div>

            <textarea
              value={emailText}
              onChange={(e) =>
                setEmailText(
                  e.target.value
                )
              }
              placeholder="Paste suspicious email content..."
              className="w-full h-[260px] rounded-3xl bg-[#020817] border border-cyan-500/10 p-5 outline-none resize-none text-gray-300"
            />

            <button
              onClick={handleAnalyze}
              className="w-full mt-6 py-4 rounded-2xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
            >
              Analyze Email
            </button>
          </div>

          {/* Terminal */}
          <div className="bg-black border border-cyan-500/20 rounded-[30px] p-6 font-mono">
            <h2 className="text-cyan-300 text-xl mb-4">
              SYSTEM_TERMINAL
            </h2>

            <div
              ref={terminalRef}
              className="h-[320px] overflow-y-auto space-y-2 text-sm"
            >
              {!isAnalyzing &&
                logs.length === 0 && (
                  <p className="text-gray-500">
                    waiting_for_input...
                  </p>
                )}

              {logs.map((log, index) => (
                <p
  key={index}
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

        {/* RESULT PANEL */}
       {showResult &&
  predictionResult && (
    <div  ref={resultRef} className="mt-10 bg-[#07101f]/90 rounded-[35px] p-8 border border-cyan-500/10">

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">
          Threat Intelligence
          Result
        </h2>

           <div className="mb-2">
  <p className="text-sm text-gray-400">
    Scan Time
  </p>

  <h3 className="text-cyan-300 text-xs mt-1">
    {scanTime}
  </h3>
</div>

        <div
          className={`px-5 py-2 rounded-full border ${
            predictionResult.phishing_detected ===
            1
              ? "bg-red-500/10 border-red-500/20 text-red-300"
              : "bg-green-500/10 border-green-500/20 text-green-300"
          }`}
        >
          {predictionResult.phishing_detected ===
          1
            ? "Threat Detected"
            : "Safe Email"}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        {/* Detection */}
        <div className="bg-[#020817] rounded-[25px] p-6 border border-cyan-500/10">
          <p className="text-gray-400 text-sm">
            Detection Status
          </p>

          <h3 className="text-2xl font-semibold mt-3">
            {predictionResult.phishing_detected ===
            1
              ? "Phishing"
              : "Safe"}
          </h3>
        </div>

        {/* Type */}
        <div className="bg-[#020817] rounded-[25px] p-6 border border-cyan-500/10">
          <p className="text-gray-400 text-sm">
            Threat Type
          </p>

          <h3 className="text-2xl font-semibold mt-3">
            {
              predictionResult.phishing_type
            }
          </h3>
        </div>

        {/* Severity */}
        <div className="bg-[#020817] rounded-[25px] p-6 border border-cyan-500/10">
          <p className="text-gray-400 text-sm">
            Risk Severity
          </p>

          <h3 className="text-2xl font-semibold mt-3 text-cyan-300">
            {
              predictionResult.severity
            }
          </h3>
        </div>
      </div>
      {/*  SECURITY SUGGESTION */}
<div className="mt-7 bg-[#020817] rounded-[28px] border border-cyan-500/10 p-6">

  <div className="flex items-center gap-3 mb-3">
    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-xl">
      🤖
    </div>

    <div>
      <h3 className="text-lg font-semibold text-cyan-300">
        Security Recommendation
      </h3>

     
    </div>
  </div>

  <p className="text-gray-300 leading-7 text-sm">

    {predictionResult.phishing_detected === 1
      ? `Potential phishing activity detected (${predictionResult.phishing_type}). Avoid clicking links, downloading attachments, or sharing credentials. Verify sender identity and report suspicious emails immediately.`
      : `No phishing indicators detected. Email appears safe, but always verify suspicious links and sender authenticity before interacting.`}

  </p>
</div>
    </div>
)}
      </div>
    </div>
  );
};

export default EmailAnalysis;