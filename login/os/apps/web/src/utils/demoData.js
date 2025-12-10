
export const demoCandidates = [
    {
        id: "demo-c-1",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        position: "Senior Frontend Developer",
        status: "interviewing",
        experience_years: 5,
        skills: "React, TypeScript, Tailwind CSS, Node.js",
        location: "San Francisco, CA",
        salary_expectation: 140000,
        notes: "Strong portfolio, good cultural fit.",
        photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: "demo-c-2",
        name: "Michael Chen",
        email: "michael.c@example.com",
        position: "Backend Engineer",
        status: "new",
        experience_years: 3,
        skills: "Python, Django, PostgreSQL, AWS",
        location: "Remote",
        salary_expectation: 120000,
        notes: "Applied via LinkedIn.",
        photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: "demo-c-3",
        name: "Emily Davis",
        email: "emily.d@example.com",
        position: "Product Manager",
        status: "offer",
        experience_years: 7,
        skills: "Agile, Jira, Product Strategy, UX Research",
        location: "New York, NY",
        salary_expectation: 160000,
        notes: "Excellent references.",
        photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: "demo-c-4",
        name: "David Wilson",
        email: "david.w@example.com",
        position: "Full Stack Engineer",
        status: "rejected",
        experience_years: 2,
        skills: "JavaScript, HTML, CSS, MongoDB",
        location: "Austin, TX",
        salary_expectation: 90000,
        notes: "Lacks experience with our tech stack.",
        photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        id: "demo-c-5",
        name: "Jessica Taylor",
        email: "jessica.t@example.com",
        position: "UX Designer",
        status: "interviewing",
        experience_years: 4,
        skills: "Figma, Sketch, Adobe XD, Prototyping",
        location: "London, UK",
        salary_expectation: 110000,
        notes: "Impressive design challenge submission.",
        photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
];

export const demoJobs = [
    {
        id: "demo-j-1",
        title: "Senior Frontend Developer",
        department: "Engineering",
        location: "San Francisco, CA",
        job_type: "full-time",
        salary_min: 130000,
        salary_max: 160000,
        status: "open",
        description: "We are looking for an experienced Frontend Developer to lead our web team.",
        requirements: "React, TypeScript, 5+ years experience"
    },
    {
        id: "demo-j-2",
        title: "Product Designer",
        department: "Design",
        location: "Remote",
        job_type: "contract",
        salary_min: 80000,
        salary_max: 120000,
        status: "open",
        description: "Join our creative team to design world-class user experiences.",
        requirements: "Figma, Portfolio, 3+ years experience"
    },
    {
        id: "demo-j-3",
        title: "DevOps Engineer",
        department: "Engineering",
        location: "New York, NY",
        job_type: "full-time",
        salary_min: 140000,
        salary_max: 180000,
        status: "draft",
        description: "Manage our cloud infrastructure and CI/CD pipelines.",
        requirements: "AWS, Kubernetes, Terraform"
    }
];

export const demoInterviews = [
    {
        id: "demo-i-1",
        candidate_id: "demo-c-1",
        job_id: "demo-j-1",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        type: "technical",
        interviewer: "Alex Tech Lead",
        notes: "Focus on React patterns.",
        status: "scheduled"
    },
    {
        id: "demo-i-2",
        candidate_id: "demo-c-5",
        job_id: "demo-j-2",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        type: "behavioral",
        interviewer: "Sam Design Manager",
        notes: "Great communication skills.",
        status: "completed"
    }
];

export const demoClients = [
    {
        id: "demo-cl-1",
        name: "Acme Corp",
        email: "contact@acme.com",
        company: "Acme Corporation",
        status: "active",
        total_revenue: 50000,
        project_count: 3
    },
    {
        id: "demo-cl-2",
        name: "Globex Inc",
        email: "info@globex.com",
        company: "Globex",
        status: "inactive",
        total_revenue: 12000,
        project_count: 1
    },
    {
        id: "demo-cl-3",
        name: "Soylent Corp",
        email: "sales@soylent.com",
        company: "Soylent Corp",
        status: "lead",
        total_revenue: 0,
        project_count: 0
    }
];

export const demoRevenue = [
    { id: "rev-1", date: "2023-01-01", amount: 12000, category: "Product Sales" },
    { id: "rev-2", date: "2023-02-01", amount: 15000, category: "Product Sales" },
    { id: "rev-3", date: "2023-03-01", amount: 18000, category: "Consulting" },
    { id: "rev-4", date: "2023-04-01", amount: 14000, category: "Product Sales" },
    { id: "rev-5", date: "2023-05-01", amount: 22000, category: "Services" }
];

export const demoEmails = [
    {
        id: "demo-e-1",
        name: "Interview Invitation",
        subject: "Invitation to Interview at GoodTalent",
        body: "Hi {name}, we would like to invite you for an interview...",
        category: "Recruiting"
    },
    {
        id: "demo-e-2",
        name: "Offer Letter",
        subject: "Job Offer from GoodTalent",
        body: "Dear {name}, we are pleased to offer you the position of...",
        category: "HR"
    }
];
