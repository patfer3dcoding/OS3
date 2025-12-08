import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or open the database file in the project root
const dbPath = path.resolve(process.cwd(), 'local.sqlite');
console.log("Initializing SQLite DB at:", dbPath);

const db = new Database(dbPath, { verbose: console.log });

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    position TEXT,
    status TEXT DEFAULT 'new',
    experience_years INTEGER,
    skills TEXT,
    location TEXT,
    salary_expectation INTEGER,
    notes TEXT,
    photo_url TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    twitter_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    job_type TEXT DEFAULT 'full-time',
    salary_min INTEGER,
    salary_max INTEGER,
    status TEXT DEFAULT 'open',
    description TEXT,
    requirements TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id TEXT,
    job_id TEXT,
    interview_date DATETIME,
    type TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(candidate_id) REFERENCES candidates(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    candidate_id TEXT,
    job_id TEXT,
    status TEXT DEFAULT 'new',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(candidate_id) REFERENCES candidates(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );

  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    status TEXT DEFAULT 'active',
    rating INTEGER DEFAULT 0,
    total_revenue INTEGER DEFAULT 0,
    total_placements INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    location TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,
    amount INTEGER NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'Pending',
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY(client_id) REFERENCES clients(id)
  );
`);

// Demo Data Candidates
const demoCandidates = [
    {
        id: 'demo-1',
        name: 'Alice Anderson',
        email: 'alice.anderson@example.com',
        position: 'Senior Frontend Developer',
        status: 'interviewing',
        experience_years: 5,
        skills: 'React, TypeScript, Tailwind CSS',
        location: 'Remote',
        salary_expectation: 120000,
        photo_url: 'https://i.pravatar.cc/150?u=alice',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
    },
    {
        id: 'demo-2',
        name: 'Bob Builder',
        email: 'bob.builder@example.com',
        position: 'Project Manager',
        status: 'new',
        experience_years: 8,
        skills: 'Agile, JIRA, Leadership',
        location: 'New York, NY',
        salary_expectation: 140000,
        photo_url: 'https://i.pravatar.cc/150?u=bob',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
    },
    {
        id: 'demo-3',
        name: 'Charlie Chaplin',
        email: 'charlie@example.com',
        position: 'Creative Director',
        status: 'offer',
        experience_years: 12,
        skills: 'Direction, Storytelling, Acting',
        location: 'Los Angeles, CA',
        salary_expectation: 180000,
        photo_url: 'https://i.pravatar.cc/150?u=charlie',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString() // 15 days ago
    },
    {
        id: "demo-4",
        name: "Sarah Parker",
        email: "sarah.parker@example.com",
        position: "UX Designer",
        status: "review",
        experience_years: 4,
        skills: "Figma, User Research, Prototyping",
        location: "London, UK",
        salary_expectation: 95000,
        photo_url: "https://i.pravatar.cc/150?u=sarah",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString() // 8 days ago
    },
    {
        id: "demo-5",
        name: "David Chen",
        email: "david.chen@example.com",
        position: "Backend Engineer",
        status: "rejected",
        experience_years: 3,
        skills: "Node.js, Python, SQL",
        location: "San Francisco, CA",
        salary_expectation: 130000,
        photo_url: "https://i.pravatar.cc/150?u=david",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString() // 20 days ago
    }
];

// Demo Data Clients
const demoClients = [
    {
        id: 'client-1',
        company_name: 'Tech Innovations Inc',
        industry: 'Software',
        status: 'active',
        rating: 5,
        total_revenue: 150000,
        total_placements: 12,
        priority: 'high',
        location: 'San Francisco, CA',
        website: 'https://techinnovations.example.com',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
    },
    {
        id: 'client-2',
        company_name: 'Global Finance Corp',
        industry: 'Finance',
        status: 'active',
        rating: 4,
        total_revenue: 85000,
        total_placements: 5,
        priority: 'medium',
        location: 'New York, NY',
        website: 'https://globalfinance.example.com',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString()
    },
    {
        id: 'client-3',
        company_name: 'Healthcare Solutions',
        industry: 'Healthcare',
        status: 'inactive',
        rating: 3,
        total_revenue: 30000,
        total_placements: 2,
        priority: 'low',
        location: 'Boston, MA',
        website: 'https://healthcaresolutions.example.com',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString()
    }
];

// Demo Data Jobs
const demoJobs = [
    {
        id: 'job-1',
        title: 'Senior Frontend Engineer',
        department: 'Engineering',
        location: 'Remote',
        job_type: 'full-time',
        salary_min: 120000,
        salary_max: 160000,
        status: 'open',
        description: 'We are looking for a Senior Frontend Engineer.',
        requirements: 'React, TypeScript, CSS, HTML',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
    },
    {
        id: 'job-2',
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY',
        job_type: 'full-time',
        salary_min: 130000,
        salary_max: 170000,
        status: 'open',
        description: 'Lead our product initiatives.',
        requirements: 'Product Management, Agile',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
    }
];

// Demo Data Interviews
const demoInterviews = [
    {
        candidate_id: 'demo-1',
        job_id: 'job-1',
        interview_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
        type: 'video',
        status: 'scheduled',
        notes: 'Initial technical screen'
    },
    {
        candidate_id: 'demo-3',
        job_id: 'job-2',
        interview_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // Yesterday
        type: 'in-person',
        status: 'completed',
        notes: 'Cultural fit interview'
    }
];

// Demo Data Applications
const demoApplications = [
    { id: 'app-1', candidate_id: 'demo-1', job_id: 'job-1', status: 'interviewing', applied_at: new Date().toISOString() },
    { id: 'app-2', candidate_id: 'demo-2', job_id: 'job-2', status: 'new', applied_at: new Date().toISOString() },
    { id: 'app-3', candidate_id: 'demo-3', job_id: 'job-2', status: 'offer', applied_at: new Date().toISOString() }
];

// Check if candidates empty and populate
const candidatesCount = db.prepare('SELECT count(*) as count FROM candidates').get().count;
if (candidatesCount === 0) {
    const insert = db.prepare(`
        INSERT INTO candidates (id, name, email, position, status, experience_years, skills, location, salary_expectation, photo_url, created_at)
        VALUES (@id, @name, @email, @position, @status, @experience_years, @skills, @location, @salary_expectation, @photo_url, @created_at)
    `);

    const insertMany = db.transaction((candidates) => {
        for (const candidate of candidates) insert.run(candidate);
    });

    insertMany(demoCandidates);
    console.log("Initialized database with demo candidates");
}

// Check if clients empty and populate
try {
    const clientsCount = db.prepare('SELECT count(*) as count FROM clients').get().count;
    if (clientsCount === 0) {
        const insert = db.prepare(`
            INSERT INTO clients (id, company_name, industry, status, rating, total_revenue, total_placements, priority, location, website, created_at)
            VALUES (@id, @company_name, @industry, @status, @rating, @total_revenue, @total_placements, @priority, @location, @website, @created_at)
        `);

        const insertMany = db.transaction((clients) => {
            for (const client of clients) insert.run(client);
        });

        insertMany(demoClients);
        console.log("Initialized database with demo clients");
    }
} catch (e) {
    console.log("Error initializing clients:", e);
}

// Check if jobs empty and populate
try {
    const jobsCount = db.prepare('SELECT count(*) as count FROM jobs').get().count;
    if (jobsCount === 0) {
        const insert = db.prepare(`
            INSERT INTO jobs (id, title, department, location, job_type, salary_min, salary_max, status, description, requirements, created_at)
            VALUES (@id, @title, @department, @location, @job_type, @salary_min, @salary_max, @status, @description, @requirements, @created_at)
        `);

        const insertMany = db.transaction((jobs) => {
            for (const job of jobs) insert.run(job);
        });

        insertMany(demoJobs);
        console.log("Initialized database with demo jobs");
    }
} catch (e) {
    console.log("Error initializing jobs:", e);
}

// Check if interviews empty and populate
try {
    const interviewsCount = db.prepare('SELECT count(*) as count FROM interviews').get().count;
    if (interviewsCount === 0) {
        const insert = db.prepare(`
            INSERT INTO interviews (candidate_id, job_id, interview_date, type, status, notes)
            VALUES (@candidate_id, @job_id, @interview_date, @type, @status, @notes)
        `);

        const insertMany = db.transaction((interviews) => {
            for (const interview of interviews) insert.run(interview);
        });

        insertMany(demoInterviews);
        console.log("Initialized database with demo interviews");
    }
} catch (e) {
    console.log("Error initializing interviews:", e);
}

// Check if applications empty and populate
try {
    const appCount = db.prepare('SELECT count(*) as count FROM applications').get().count;
    if (appCount === 0) {
        const insert = db.prepare(`
            INSERT INTO applications (id, candidate_id, job_id, status, applied_at)
            VALUES (@id, @candidate_id, @job_id, @status, @applied_at)
        `);

        const insertMany = db.transaction((apps) => {
            for (const app of apps) insert.run(app);
        });

        insertMany(demoApplications);
        console.log("Initialized database with demo applications");
    }
} catch (e) {
    console.log("Error initializing applications:", e);
}

// Check if payments empty and populate
try {
    const paymentsCount = db.prepare('SELECT count(*) as count FROM payments').get().count;
    if (paymentsCount === 0) {
        const demoPayments = [
            { client_id: 'client-1', amount: 25000, type: 'Placement Fee', status: 'Paid', date: '2024-06-15' },
            { client_id: 'client-2', amount: 18000, type: 'Retainer', status: 'Paid', date: '2024-06-12' },
            { client_id: 'client-3', amount: 22000, type: 'Placement Fee', status: 'Pending', date: '2024-06-10' },
            { client_id: 'client-1', amount: 15000, type: 'Placement Fee', status: 'Paid', date: '2024-06-08' }
        ];

        const insert = db.prepare(`
            INSERT INTO payments (client_id, amount, type, status, date)
            VALUES (@client_id, @amount, @type, @status, @date)
        `);

        const insertMany = db.transaction((payments) => {
            for (const payment of payments) insert.run(payment);
        });

        insertMany(demoPayments);
        console.log("Initialized database with demo payments");
    }
} catch (e) {
    console.log("Error initializing payments:", e);
}

export default db;
