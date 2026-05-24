import { useState } from "react";
import {
  ShieldAlert,
  Activity,
  Upload,
  FileText,
  Wifi,
} from "lucide-react";

export default function LogMonitoring() {
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

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [uploadError, setUploadError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  // -------------------------
  // FORM INPUT
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // -------------------------
  // SECURE FILE VALIDATION
  // -------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedExtensions = [
      "csv",
      "log",
      "txt",
    ];

    const fileExtension =
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    // dangerous file block
    if (
      !allowedExtensions.includes(
        fileExtension
      )
    ) {
      setUploadError(
        "Only .csv, .log and .txt files are allowed."
      );

      setSelectedFile(null);
      return;
    }

    // file size check
    if (file.size > 2 * 1024 * 1024) {
      setUploadError(
        "Maximum file size is 2MB."
      );

      setSelectedFile(null);
      return;
    }

    setUploadError("");
    setSelectedFile(file);
  };

  // -------------------------
  // MANUAL FORM SUBMIT
  // -------------------------
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response =
        await fetch(
          "http://127.0.0.1:5000/predict-log",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              network_packet_size:
                Number(
                  formData.network_packet_size
                ),

              protocol_type:
                formData.protocol_type,

              login_attempts:
                Number(
                  formData.login_attempts
                ),

              session_duration:
                Number(
                  formData.session_duration
                ),

              encryption_used:
                formData.encryption_used,

              ip_reputation_score:
                Number(
                  formData.ip_reputation_score
                ),

              failed_logins:
                Number(
                  formData.failed_logins
                ),

              browser_type:
                formData.browser_type,

              unusual_time_access:
                Number(
                  formData.unusual_time_access
                ),
            }),
          }
        );

      const data =
        await response.json();

      setResult(data);
    } catch (error) {
      console.log(error);

      alert(
        "Backend connection failed."
      );
    }

    setLoading(false);
  };

  // -------------------------
  // FILE UPLOAD
  // -------------------------
  const handleFileUpload =
    async () => {
      if (!selectedFile) {
        alert(
          "Please select a log file."
        );

        return;
      }

      setLoading(true);

      try {
        const formDataUpload =
          new FormData();

        formDataUpload.append(
          "file",
          selectedFile
        );

        const response =
          await fetch(
            "http://127.0.0.1:5000/upload-log-file",
            {
              method: "POST",
              body: formDataUpload,
            }
          );

        const data =
          await response.json();

        setResult(data);
      } catch (error) {
        console.log(error);

        alert("Upload failed.");
      }

      setLoading(false);
    };

  return (
    <div className="min-h-screen bg-[#071014] text-white p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-cyan-300">
          Log Monitoring
        </h1>

        <p className="text-gray-400 mt-2">
          Analyze suspicious logs
          manually or upload a
          security log file.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="space-y-8">

          {/* FILE UPLOAD */}
          <div className="bg-white/5 border border-cyan-500/20 rounded-3xl backdrop-blur-xl p-8">

            <div className="flex items-center gap-3 mb-5">
              <Upload className="text-emerald-400" />

              <h2 className="text-2xl font-semibold">
                Upload Log File
              </h2>
            </div>

            <div className="border-2 border-dashed border-cyan-500/30 rounded-2xl p-10 text-center hover:border-emerald-400 transition">

              <FileText className="mx-auto mb-4 text-cyan-300" />

              <p className="text-gray-300 mb-2">
                Upload .csv, .log or
                .txt files
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Maximum size: 2MB
              </p>

              <input
                type="file"
                accept=".csv,.log,.txt"
                onChange={
                  handleFileChange
                }
                className="text-sm"
              />

              {selectedFile && (
                <p className="mt-4 text-emerald-400">
                  {selectedFile.name}
                </p>
              )}

              {uploadError && (
                <p className="mt-3 text-red-400">
                  {uploadError}
                </p>
              )}

              <button
                onClick={
                  handleFileUpload
                }
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold hover:scale-[1.02] transition"
              >
                {loading
                  ? "Uploading..."
                  : "Analyze Log File"}
              </button>
            </div>
          </div>

          {/* MANUAL INPUT */}
          <div className="bg-white/5 border border-cyan-500/20 rounded-3xl backdrop-blur-xl p-8">

            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-cyan-300" />

              <h2 className="text-2xl font-semibold">
                Manual Log Analysis
              </h2>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >

              <input
                type="number"
                name="network_packet_size"
                placeholder="Network Packet Size"
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
                onChange={
                  handleChange
                }
                required
              />

              <select
                name="protocol_type"
                onChange={
                  handleChange
                }
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
              >
                <option>TCP</option>
                <option>UDP</option>
                <option>ICMP</option>
              </select>

              <input
                type="number"
                name="login_attempts"
                placeholder="Login Attempts"
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="number"
                name="session_duration"
                placeholder="Session Duration"
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
                onChange={
                  handleChange
                }
                required
              />

              <select
                name="encryption_used"
                onChange={
                  handleChange
                }
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
              >
                <option>AES</option>
                <option>DES</option>
                <option>None</option>
              </select>

              <input
                type="number"
                step="0.1"
                name="ip_reputation_score"
                placeholder="IP Reputation Score"
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="number"
                name="failed_logins"
                placeholder="Failed Logins"
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
                onChange={
                  handleChange
                }
                required
              />

              <select
                name="browser_type"
                onChange={
                  handleChange
                }
                className="w-full bg-[#0b1a1f] rounded-xl p-4 border border-cyan-400/20"
              >
                <option>Chrome</option>
                <option>Firefox</option>
                <option>Edge</option>
                <option>Safari</option>
                <option>Unknown</option>
              </select>

              <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold hover:scale-[1.02] transition">
                {loading
                  ? "Analyzing..."
                  : "Analyze Log"}
              </button>
            </form>
          </div>
        </div>

        {/* RESULT PANEL */}
        <div className="bg-white/5 border border-emerald-500/20 rounded-3xl backdrop-blur-xl p-8">

          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="text-cyan-300" />

            <h2 className="text-2xl font-semibold">
              Threat Analysis
            </h2>
          </div>

          {!result ? (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              No analysis available
            </div>
          ) : (
            <div className="space-y-6">

              <div className="bg-[#0b1a1f] rounded-2xl p-6">
                <p className="text-gray-400">
                  Threat Status
                </p>

                <h2
                  className={`text-3xl font-bold mt-2 ${
                    result.attack_detected
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {result.attack_detected
                    ? "Threat Detected"
                    : "No Threat Found"}
                </h2>
              </div>

              <div className="bg-[#0b1a1f] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="text-emerald-400" />

                  <h3>
                    Risk Indicator
                  </h3>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${
                      result.attack_detected
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                    style={{
                      width:
                        result.attack_detected
                          ? "80%"
                          : "25%",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}