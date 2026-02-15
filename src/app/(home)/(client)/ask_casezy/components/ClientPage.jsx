"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Send } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const prettifyReport = (rawText) => {
  if (!rawText) return "";

  let text = `${rawText}`.trim();

  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1);
  }

  text = text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\r\n/g, "\n");

  text = text.replace(/^-{20,}\n([A-Z0-9 &\-/]+)\n-{20,}$/gm, "## $1");
  text = text.replace(/^DISCLAIMER$/gm, "## DISCLAIMER");
  text = text.replace(/^Generated:\s*(.+)$/gm, "**Generated:** $1");

  return text.trim();
};

const parseSections = (text) => {
  const normalized = `${text || ""}`.trim();
  if (!normalized) return [];

  const chunks = normalized.split(/\n(?=##\s+)/g);
  return chunks.map((chunk, index) => {
    const lines = chunk.split("\n");
    const firstLine = lines[0] || "";
    const title = firstLine.startsWith("## ")
      ? firstLine.replace(/^##\s+/, "").trim()
      : index === 0
        ? "Overview"
        : `Section ${index + 1}`;
    const body = firstLine.startsWith("## ")
      ? lines.slice(1).join("\n").trim()
      : chunk.trim();

    return {
      id: `${title}-${index}`,
      title,
      body,
    };
  });
};

const extractHighlights = (text) => {
  const source = `${text || ""}`;
  const complexity = source.match(/Complexity Tier:\s*([^\n]+)/i)?.[1]?.trim();
  const classification = source
    .match(/Classification:\s*([^\n]+)/i)?.[1]
    ?.trim();
  const recommendation = source
    .match(/Recommendation:\s*([^\n]+)/i)?.[1]
    ?.trim();

  return {
    complexity: complexity || "Not detected",
    classification: classification || "Not detected",
    recommendation: recommendation || "Review the full report sections below.",
  };
};

export default function Ask_Casezy_Simple() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState(null);

  const sections = useMemo(() => parseSections(reportText), [reportText]);
  const highlights = useMemo(() => extractHighlights(reportText), [reportText]);

  const handleCopy = async () => {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
    } catch (copyError) {
      console.error(copyError);
      setError("Could not copy report. Please copy manually.");
    }
  };

  const handleDownload = () => {
    if (!reportText) return;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `legal-research-report-${Date.now()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setReportText(""); 

    try {
      const res = await axios.post(
        "http://10.10.7.64:8002/query/report",
        {
          query: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status !== 200) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = res.data;
      const result =
        data?.report ||
        data?.response ||
        data?.result ||
        data?.message ||
        JSON.stringify(data);
      setReportText(prettifyReport(result));
    } catch (err) {
      console.error(err);
      setError("Failed to analyze. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 max-w-4xl mx-auto w-11/12 text-white">
      <div className="space-y-8">
        {/* Input Section */}
        <div className="bg-secondary p-6 rounded-2xl shadow-xl border border-white/5">
          <h2 className="text-xl font-bold mb-4 text-primary">
            Describe your situation
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter details here..."
              className="w-full h-40 p-4 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
            />

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full py-4 bg-primary hover:bg-opacity-90 disabled:opacity-50 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Response Section */}
        {reportText && (
          <div className="bg-[#1B1D22] p-6 lg:p-8 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">
                Analysis Results
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 text-xs rounded-lg border border-white/20 hover:bg-white/10 transition"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-2 text-xs rounded-lg border border-white/20 hover:bg-white/10 transition"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Complexity</p>
                <p className="text-sm mt-1 text-white">{highlights.complexity}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Classification</p>
                <p className="text-sm mt-1 text-white">{highlights.classification}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">Recommendation</p>
                <p className="text-sm mt-1 text-white line-clamp-3">{highlights.recommendation}</p>
              </div>
            </div>

            <div className="space-y-3">
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <details
                    key={section.id}
                    className="rounded-xl bg-black/20 border border-white/10 p-3"
                    open={index < 2}
                  >
                    <summary className="cursor-pointer text-sm md:text-base font-semibold text-white">
                      {section.title}
                    </summary>
                    <div className="mt-3 text-gray-200 leading-relaxed text-sm md:text-base prose prose-invert prose-p:my-2 prose-li:my-1 max-w-none">
                      <ReactMarkdown>{section.body || "No content."}</ReactMarkdown>
                    </div>
                  </details>
                ))
              ) : (
                <div className="text-gray-200 leading-relaxed text-base md:text-lg prose prose-invert prose-p:my-2 prose-li:my-1 max-w-none">
                  <ReactMarkdown>{reportText}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
