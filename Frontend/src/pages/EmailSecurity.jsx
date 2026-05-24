import { useState } from "react";
import axios from "axios";

import {
  ShieldAlert,
  MailSearch,
  TriangleAlert,
  ShieldCheck,
  Loader2
} from "lucide-react";

import { motion } from "framer-motion";

function EmailSecurity() {

  const [emailText, setEmailText] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const analyzeEmail = async () => {

    if (!emailText.trim()) {
      alert("Please enter email content");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/predict-phishing",
        {
          email_text: emailText
        }
      );

      setResult(response.data);

    } catch (error) {

      console.error(error);

      alert("Backend connection failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-5xl font-bold">
          Email Threat Detection
        </h1>

        <p className="text-gray-400 mt-2 text-lg">
          Detect phishing emails using AI-based analysis
        </p>

      </div>

      {/* Main Grid */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Input Panel */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
          rounded-3xl
          border border-cyan-500/20
          bg-white/5
          backdrop-blur-2xl
          p-8
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <MailSearch className="text-cyan-400" />

            <h2 className="text-2xl font-semibold">
              Email Scanner
            </h2>

          </div>

          <textarea
            placeholder="Paste suspicious email content here..."
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            className="
            w-full h-[320px]
            rounded-2xl
            bg-black/30
            border border-white/10
            outline-none
            p-5
            resize-none
            text-white
            focus:border-cyan-400
            transition
            "
          />

          <button
            onClick={analyzeEmail}
            disabled={loading}
            className="
            mt-5
            w-full
            py-4
            rounded-2xl
            font-semibold
            text-lg
            bg-gradient-to-r
            from-cyan-500
            to-emerald-500
            hover:scale-[1.02]
            transition
            flex
            justify-center
            items-center
            gap-2
            "
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ShieldAlert />
                Analyze Email
              </>
            )}

          </button>

        </motion.div>

        {/* Result Panel */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
          rounded-3xl
          border border-emerald-500/20
          bg-white/5
          backdrop-blur-2xl
          p-8
          "
        >

          <h2 className="text-2xl font-semibold mb-6">
            Threat Analysis Result
          </h2>

          {!result ? (

            <div className="h-full flex items-center justify-center text-gray-500 text-lg">

              No email analyzed yet

            </div>

          ) : (

            <div className="space-y-6">

              {/* Phishing Status */}

              <div className="
              rounded-2xl
              bg-black/30
              p-5
              border border-white/10
              ">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-gray-400 mb-1">
                      Phishing Detection
                    </p>

                    <h3 className="text-2xl font-bold">

                      {result.phishing_detected === 1
                        ? "Phishing Detected"
                        : "Safe Email"}

                    </h3>

                  </div>

                  {result.phishing_detected === 1 ? (
                    <TriangleAlert
                      size={45}
                      className="text-red-400"
                    />
                  ) : (
                    <ShieldCheck
                      size={45}
                      className="text-emerald-400"
                    />
                  )}

                </div>

              </div>

              {/* Type */}

              <div className="
              rounded-2xl
              bg-black/30
              p-5
              border border-white/10
              ">

                <p className="text-gray-400 mb-2">
                  Phishing Type
                </p>

                <h3 className="text-xl font-semibold text-cyan-400">
                  {result.phishing_type}
                </h3>

              </div>

              {/* Severity */}

              <div className="
              rounded-2xl
              bg-black/30
              p-5
              border border-white/10
              ">

                <p className="text-gray-400 mb-2">
                  Threat Severity
                </p>

                <div className="flex items-center gap-3">

                  <span className={`
                  px-4 py-2 rounded-full text-sm font-semibold

                  ${result.severity === "high"
                    ? "bg-red-500/20 text-red-400"
                    : result.severity === "medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-emerald-500/20 text-emerald-400"}
                  `}>

                    {result.severity.toUpperCase()}

                  </span>

                </div>

              </div>

            </div>

          )}

        </motion.div>

      </div>

    </div>
  );
}

export default EmailSecurity;