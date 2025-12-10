import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CandidatesList } from "./CandidatesList";
import { CandidateDetails } from "./CandidateDetails";
import { CandidateForm } from "./CandidateForm";
import { BulkImport } from "./BulkImport";
import { exportToCSV } from "../../../utils/exportUtils";

export function CandidatesWindow() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isBulkImport, setIsBulkImport] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "new",
    experience_years: "",
    skills: "",
    location: "",
    salary_expectation: "",
    notes: "",
    photo_url: "",
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    twitter_url: "",
  });

  // Fetch candidates
  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ["candidates", searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) throw new Error("Failed to fetch candidates");
      return response.json();
    },
  });

  // Add candidate mutation
  const addCandidateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          skills: data.skills
            ? data.skills.split(",").map((s) => s.trim())
            : [],
          experience_years: data.experience_years
            ? parseInt(data.experience_years)
            : null,
          salary_expectation: data.salary_expectation
            ? parseInt(data.salary_expectation)
            : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to add candidate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setIsAddingNew(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        status: "new",
        experience_years: "",
        skills: "",
        location: "",
        salary_expectation: "",
        notes: "",
        photo_url: "",
        resume_url: "",
        linkedin_url: "",
        github_url: "",
        portfolio_url: "",
        twitter_url: "",
      });
    },
  });

  // Update candidate mutation
  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update candidate");
      return response.json();
    },
    onSuccess: (updatedCandidate) => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      if (
        selectedCandidate &&
        selectedCandidate.id === updatedCandidate.candidate.id
      ) {
        setSelectedCandidate(updatedCandidate.candidate);
      }
    },
  });

  // Delete candidate mutation
  const deleteCandidateMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete candidate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setSelectedCandidate(null);
    },
  });

  const candidates = candidatesData?.candidates || [];

  return (
    <div className="flex h-full">
      {/* Sidebar - Candidate List */}
      <CandidatesList
        candidates={candidates}
        isLoading={isLoading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        selectedCandidate={selectedCandidate}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onCandidateSelect={(candidate) => {
          setSelectedCandidate(candidate);
          setIsAddingNew(false);
          setIsBulkImport(false);
        }}
        onAddNew={() => {
          setIsAddingNew(true);
          setIsBulkImport(false);
        }}
        onBulkImport={() => {
          setIsBulkImport(true);
          setIsAddingNew(false);
        }}
        onExport={() => exportToCSV(candidates, "candidates")}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {isBulkImport ? (
          <BulkImport
            onImportComplete={() => {
              setIsBulkImport(false);
              queryClient.invalidateQueries({ queryKey: ["candidates"] });
            }}
            onCancel={() => setIsBulkImport(false)}
          />
        ) : isAddingNew ? (
          <CandidateForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={(e) => {
              e.preventDefault();
              addCandidateMutation.mutate(formData);
            }}
            onCancel={() => setIsAddingNew(false)}
            isSubmitting={addCandidateMutation.isPending}
          />
        ) : selectedCandidate ? (
          <CandidateDetails
            candidate={selectedCandidate}
            onStatusChange={(status) => {
              updateCandidateMutation.mutate({
                id: selectedCandidate.id,
                data: { status },
              });
            }}
            onDelete={() => {
              if (confirm("Delete this candidate?")) {
                deleteCandidateMutation.mutate(selectedCandidate.id);
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/50">
            Select a candidate to view details
          </div>
        )}
      </div>
    </div>
  );
}
