import * as React from 'react';

function useUpload() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const upload = React.useCallback(async (input) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      // Handle direct File object (used by Chatbot and CandidateForm)
      if (input instanceof File) {
        const formData = new FormData();
        formData.append("file", input);
        response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
      }
      // Handle { file: File } wrapper
      else if ("file" in input && input.file) {
        const formData = new FormData();
        formData.append("file", input.file);
        response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
      }
      // Handle { url: string }
      else if ("url" in input) {
        response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: input.url })
        });
      }
      // Handle { base64: string }
      else if ("base64" in input) {
        response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: input.base64 })
        });
      }
      else {
        // Fallback for raw buffer or other types
        response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: input.buffer || input
        });
      }

      if (!response.ok) {
        if (response.status === 413) throw new Error("File too large");
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url; // Consumers expect just the URL in some cases, or we can return object
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      const errorMessage = uploadError.message || "Upload failed";
      setError(errorMessage);
      throw uploadError; // Re-throw so consumers can catch it
    } finally {
      setLoading(false);
    }
  }, []);

  // Return object to match consumer destructuring: const { upload, uploading } = useUpload();
  // Mapping 'loading' to 'uploading' to match consumer expectation if needed, or consumers verify 'loading'.
  // Chatbot.jsx uses: const { upload, uploading } = useUpload();
  // CandidateForm.jsx uses: const { upload, uploading } = useUpload();
  return { upload, uploading: loading, error, loading };
}

export { useUpload };
export default useUpload;