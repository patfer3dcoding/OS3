import { Upload, FileSpreadsheet, Loader2, Check, X } from "lucide-react";
import { useState } from "react";

export function BulkImport({ onImportComplete, onCancel }) {
  const [importing, setImporting] = useState(false);
  const [parsedCandidates, setParsedCandidates] = useState([]);
  const [importResults, setImportResults] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();

      const response = await fetch("/api/candidates/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText: text }),
      });

      if (!response.ok) throw new Error("Failed to parse CSV");

      const result = await response.json();
      setParsedCandidates(result.data);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Failed to parse CSV file");
    } finally {
      setImporting(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    const results = { success: 0, failed: 0, errors: [] };

    for (const candidate of parsedCandidates) {
      try {
        const response = await fetch("/api/candidates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...candidate,
            status: "new",
          }),
        });

        if (response.ok) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(
            `${candidate.name || "Unknown"}: ${response.statusText}`,
          );
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${candidate.name || "Unknown"}: ${error.message}`);
      }
    }

    setImportResults(results);
    setImporting(false);
  };

  if (importResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Import Results</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-green-500/20 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-semibold">Success</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {importResults.success}
              </div>
            </div>

            <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <X className="w-6 h-6 text-red-400" />
                <span className="text-red-400 font-semibold">Failed</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {importResults.failed}
              </div>
            </div>
          </div>

          {importResults.errors.length > 0 && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-white font-semibold mb-2">Errors:</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {importResults.errors.map((error, idx) => (
                  <div key={idx} className="text-sm text-red-400">
                    • {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onImportComplete}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">
        Bulk Import Candidates
      </h2>

      {parsedCandidates.length === 0 ? (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-blue-500/50 transition-all">
            <label className="cursor-pointer">
              <FileSpreadsheet className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                Upload CSV File
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Upload a CSV file with candidate information
              </p>
              {importing && (
                <Loader2 className="w-6 h-6 text-blue-400 mx-auto animate-spin" />
              )}
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-white font-semibold mb-2">
              CSV Format Example:
            </h4>
            <pre className="text-xs text-white/70 overflow-x-auto">
              {`Name,Email,Phone,Position,Location,Experience,Skills,Salary
John Doe,john@example.com,555-0100,Software Engineer,San Francisco,5,"React,Node.js,Python",120000`}
            </pre>
          </div>

          <button
            onClick={onCancel}
            className="w-full px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="text-white font-semibold mb-2">
              Found {parsedCandidates.length} candidates
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {parsedCandidates.map((candidate, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="text-white font-medium">{candidate.name}</div>
                  <div className="text-white/60 text-sm">{candidate.email}</div>
                  <div className="text-white/60 text-sm">
                    {candidate.position}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-all disabled:opacity-50"
            >
              {importing
                ? "Importing..."
                : `Import ${parsedCandidates.length} Candidates`}
            </button>
            <button
              onClick={() => setParsedCandidates([])}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
