"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Send, Copy, Download, AlertCircle } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

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
    .replace(/\u00a0/g, " ")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\r\n/g, "\n");

  text = text.replace(/^-{10,}\n?([A-Z0-9 &\/\\-]+)\n?-{10,}$/gm, "## $1");

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

    const isHeader = firstLine.startsWith("## ");
    const title = isHeader
      ? firstLine.replace(/^##\s+/, "").trim()
      : index === 0
        ? "Overview"
        : `Section ${index + 1}`;

    const body = isHeader ? lines.slice(1).join("\n").trim() : chunk.trim();

    return {
      id: `${title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      title,
      body,
    };
  });
};

/**
 * Regex extraction for the top highlight cards
 */
const extractHighlights = (text) => {
  const source = `${text || ""}`;
  const complexity = source.match(/Complexity Tier:\s*([^\n]+)/i)?.[1]?.trim();
  const classification = source
    .match(/Classification:\s*([^\n]+)/i)?.[1]
    ?.trim();
  const recommendation = source
    .match(/Recommendation:\s*([\s\S]*?)(?=\n\n|\n##|$)/i)?.[1]
    ?.trim();

  // Extract tier number from complexity (e.g., "Complexity Tier: 3" -> "3")
  const tierNumber = complexity?.match(/\d+/)?.[0] || null;

  return {
    complexity: complexity || "N/A",
    tierNumber: tierNumber,
    classification: classification || "Pending Review",
    recommendation: recommendation || "Review the full report sections below.",
  };
};

export default function Ask_Casezy_Simple() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState(null);

  const sections = useMemo(() => parseSections(reportText), [reportText]);
  const highlights = useMemo(() => extractHighlights(reportText), [reportText]);

  const handleCopy = async () => {
    if (!reportText) return;
    await navigator.clipboard.writeText(reportText);
    alert("Report copied to clipboard!");
  };

  const handleDownload = () => {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `legal-report-${new Date().toISOString().split("T")[0]}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleBrowseAttorney = () => {
    if (!reportText) return;

    localStorage.setItem("casezy_consult_message", reportText);
    if (!highlights.tierNumber) {
      setError(
        "Could not detect a case tier from the AI report. Please run analysis again.",
      );
      return;
    }

    router.push(`/attorneys?tier=${highlights.tierNumber}`);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setReportText("");

    try {
      const res = await axios.post("http://16.58.147.156:8002/query-report", {
        query: description,
        top_k: 5,
      });

      const data = res.data;
      const result =
        data?.report || data?.response || data?.result || JSON.stringify(data);
      const formattedReport = prettifyReport(result);
      setReportText(formattedReport);
      localStorage.setItem("casezy_consult_message", formattedReport);
    } catch (err) {
      setError(
        "Analysis failed. Please check your connection or try a different query.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] pt-24 pb-12 text-gray-100 font-sans">
      <div className="max-w-5xl mx-auto w-11/12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CASEZY ANALYST
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Michigan Legal Intelligence Engine
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-[#1B1D22] p-6 rounded-2xl border border-white/5 shadow-2xl">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your legal situation in detail..."
              className="w-full h-44 p-5 bg-black/30 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-all placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing Case...
                </>
              ) : (
                <>
                  <Send size={18} /> Run Full Legal Analysis
                </>
              )}
            </button>
          </form>
        </div>

        {reportText && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Intelligence Report
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
                >
                  <Copy size={14} /> Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
                >
                  <Download size={14} /> PDF/Text
                </button>
                <button
                  onClick={handleBrowseAttorney}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded-lg transition"
                >
                  Find Matched Attorneys
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Attorney Type",
                  val: highlights.complexity,
                  color: "text-orange-400",
                },
                {
                  label: "Classification",
                  val: highlights.classification,
                  color: "text-blue-400",
                },
                {
                  label: "Recommendation",
                  val: highlights.recommendation,
                  color: "text-emerald-400",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#1B1D22] border border-white/5 shadow-inner"
                >
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">
                    {card.label}
                  </p>
                  <p
                    className={`text-sm font-semibold ${card.color} line-clamp-2`}
                  >
                    {card.val}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {sections.map((section, idx) => (
                <details
                  key={section.id}
                  className="group bg-[#1B1D22] border border-white/5 rounded-2xl overflow-hidden transition-all"
                  open={idx < 2}
                >
                  <summary className="list-none cursor-pointer p-5 flex justify-between items-center hover:bg-white/2">
                    <span className="font-bold text-sm tracking-wide text-gray-200 uppercase">
                      {section.title}
                    </span>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <div className="px-5 pb-6 text-gray-300 border-t border-white/5 pt-4">
                    <article className="prose prose-invert prose-sm max-w-none leading-relaxed prose-headings:text-blue-400 prose-strong:text-white prose-p:text-gray-400">
                      <ReactMarkdown>{section.body}</ReactMarkdown>
                    </article>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
