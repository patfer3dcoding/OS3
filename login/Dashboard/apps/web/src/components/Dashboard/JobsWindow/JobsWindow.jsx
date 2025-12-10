import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JobsList } from "./JobsList";
import { JobDetails } from "./JobDetails";
import { JobForm } from "./JobForm";

export function JobsWindow() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    job_type: "full-time",
    salary_min: "",
    salary_max: "",
    status: "open",
    description: "",
    requirements: "",
  });

  // Fetch jobs
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ["jobs", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  // Add job mutation
  const addJobMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          requirements: data.requirements
            ? data.requirements.split("\n").filter((r) => r.trim())
            : [],
          salary_min: data.salary_min ? parseInt(data.salary_min) : null,
          salary_max: data.salary_max ? parseInt(data.salary_max) : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to add job");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsAddingNew(false);
      setFormData({
        title: "",
        department: "",
        location: "",
        job_type: "full-time",
        salary_min: "",
        salary_max: "",
        status: "open",
        description: "",
        requirements: "",
      });
    },
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          requirements: data.requirements
            ? data.requirements.split("\n").filter((r) => r.trim())
            : [],
          salary_min: data.salary_min ? parseInt(data.salary_min) : null,
          salary_max: data.salary_max ? parseInt(data.salary_max) : null,
        }),
      });
      if (!response.ok) throw new Error("Failed to update job");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsEditing(false);
      setSelectedJob(null);
      setFormData({
        title: "",
        department: "",
        location: "",
        job_type: "full-time",
        salary_min: "",
        salary_max: "",
        status: "open",
        description: "",
        requirements: "",
      });
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete job");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setSelectedJob(null);
    },
  });

  const jobs = jobsData?.jobs || [];

  return (
    <div className="flex h-full">
      {/* Sidebar - Job List */}
      <JobsList
        jobs={jobs}
        isLoading={isLoading}
        searchQuery={searchQuery}
        selectedJob={selectedJob}
        onSearchChange={setSearchQuery}
        onJobSelect={(job) => {
          setSelectedJob(job);
          setIsAddingNew(false);
          setIsEditing(false);
        }}
        onAddNew={() => {
          setIsAddingNew(true);
          setIsEditing(false);
          setSelectedJob(null);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {isAddingNew ? (
          <JobForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={(e) => {
              e.preventDefault();
              addJobMutation.mutate(formData);
            }}
            onCancel={() => setIsAddingNew(false)}
            isSubmitting={addJobMutation.isPending}
          />
        ) : isEditing && selectedJob ? (
          <JobForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={(e) => {
              e.preventDefault();
              updateJobMutation.mutate({ id: selectedJob.id, data: formData });
            }}
            onCancel={() => {
              setIsEditing(false);
              setFormData({
                title: "",
                department: "",
                location: "",
                job_type: "full-time",
                salary_min: "",
                salary_max: "",
                status: "open",
                description: "",
                requirements: "",
              });
            }}
            isSubmitting={updateJobMutation.isPending}
          />
        ) : selectedJob ? (
          <JobDetails
            job={selectedJob}
            onEdit={() => {
              setIsEditing(true);
              setFormData({
                title: selectedJob.title || "",
                department: selectedJob.department || "",
                location: selectedJob.location || "",
                job_type: selectedJob.job_type || "full-time",
                salary_min: selectedJob.salary_min || "",
                salary_max: selectedJob.salary_max || "",
                status: selectedJob.status || "open",
                description: selectedJob.description || "",
                requirements: Array.isArray(selectedJob.requirements)
                  ? selectedJob.requirements.join("\n")
                  : "",
              });
            }}
            onDelete={() => {
              if (confirm("Delete this job posting?")) {
                deleteJobMutation.mutate(selectedJob.id);
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/50">
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
}
