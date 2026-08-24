export const ROADMAP_CATEGORIES = [
  { slug: "frontend", label: "Frontend" },
  { slug: "backend", label: "Backend" },
  { slug: "full-stack", label: "Full Stack" },
  { slug: "ai", label: "AI" },
  { slug: "ml", label: "ML" },
  { slug: "data-science", label: "Data Science" },
  { slug: "devops", label: "DevOps" },
  { slug: "cloud", label: "Cloud" },
  { slug: "ui-ux", label: "UI/UX" },
  { slug: "qa", label: "QA" },
  { slug: "cyber-security", label: "Cyber Security" },
  { slug: "mobile-development", label: "Mobile Development" },
];

export const ROADMAPS = {
  frontend: {
    title: "Frontend Developer",
    tagline: "A complete, in-depth path from your first `<div>` to a job-ready, AI-fluent frontend engineer.",
    steps: [
      { title: "HTML Fundamentals", description: "The markup every page is built on.", topics: [
        { subject: "HTML", items: ["HTML5 Basics", "Semantic HTML", "Forms & Validation", "Tables", "Meta Tags", "SEO Basics", "Accessibility (ARIA)", "Multimedia", "SVG", "Best Practices", "HTML Entities", "Iframes", "Lists", "Attributes", "Head vs Body", "Block vs Inline Elements", "Canvas Basics", "Web Storage", "HTML Templates", "HTML Project Structure"] },
      ] },
      { title: "CSS Fundamentals", description: "Styling, layout, and making things look right on every screen.", topics: [
        { subject: "CSS", items: ["CSS Selectors", "Box Model", "Display Property", "Positioning", "Flexbox", "CSS Grid", "Responsive Design", "Media Queries", "Animations", "Transitions", "Variables", "Pseudo Classes", "Pseudo Elements", "Gradients", "Shadows", "Units (px, rem, em, vh, vw)", "Overflow", "Z-index", "CSS Architecture", "CSS Best Practices"] },
      ] },
      { title: "JavaScript Essentials", description: "The language that makes the page interactive.", topics: [
        { subject: "JavaScript", items: ["Variables", "Data Types", "Operators", "Loops", "Functions", "Arrays", "Objects", "DOM Manipulation", "Events", "Async JavaScript", "Promises", "Fetch API", "Async/Await", "ES6 Features", "Modules", "Error Handling", "Local Storage", "Session Storage", "Closures", "Higher Order Functions"] },
      ] },
      { title: "Version Control (Git & GitHub)", description: "The workflow every real codebase runs on.", topics: [
        { subject: "Git & GitHub", items: ["Git Installation", "Git Workflow", "Git Init", "Clone Repository", "Commit", "Push", "Pull", "Branching", "Merge", "Merge Conflicts", "GitHub Repository", "Pull Requests", "Fork", "Rebase", "Cherry Pick", "Tags", "Releases", "Git Ignore", "GitHub Actions (Basics)", "Best Practices"] },
      ] },
      { title: "Responsive Design", description: "Making one layout work everywhere, from phone to desktop.", topics: [
        { subject: "Responsive Design", items: ["Mobile First Design", "Breakpoints", "Fluid Layouts", "CSS Grid Layout", "Flexbox Layout", "Responsive Images", "Typography", "Accessibility", "Mobile Navigation", "Viewport", "Device Testing", "Browser Testing", "CSS Clamp()", "Container Queries", "Responsive Components", "Dark Mode", "Print CSS", "Performance", "Responsive Tables", "Best Practices"] },
      ] },
      { title: "CSS Frameworks", description: "Building UI faster with utility-first and component libraries.", topics: [
        { subject: "CSS Frameworks", items: ["Tailwind CSS", "Bootstrap", "DaisyUI", "Shadcn/UI", "Material UI", "Chakra UI", "Ant Design", "Utility Classes", "Theme Customization", "Responsive Utilities", "Components", "Icons", "Grid Systems", "Forms", "Buttons", "Cards", "Modals", "Navigation", "Dark Mode", "Best Practices"] },
      ] },
      { title: "React.js", description: "The component-based library most frontend jobs are built around.", topics: [
        { subject: "React.js", items: ["Components", "JSX", "Props", "State", "Events", "Hooks", "useEffect", "useMemo", "useCallback", "Context API", "Routing", "Forms", "API Integration", "Conditional Rendering", "Lists", "Error Boundaries", "Lazy Loading", "Suspense", "Performance", "Best Practices"] },
      ] },
      { title: "State Management", description: "Managing data that needs to live beyond a single component.", topics: [
        { subject: "State Management", items: ["Context API", "Redux Toolkit", "Zustand", "Recoil", "MobX", "Reducers", "Actions", "Store", "Selectors", "Middleware", "Async State", "Persist State", "DevTools", "Global State", "Local State", "Derived State", "Performance", "Best Practices", "Folder Structure", "Common Mistakes"] },
      ] },
      { title: "Next.js", description: "The production React framework — routing, rendering, and SEO built in.", topics: [
        { subject: "Next.js", items: ["App Router", "Pages Router", "Routing", "Layouts", "Server Components", "Client Components", "Metadata API", "API Routes", "Image Optimization", "Fonts", "Dynamic Routes", "Middleware", "Authentication", "SEO", "Static Generation", "Server Side Rendering", "ISR", "Deployment", "Performance", "Best Practices"] },
      ] },
      { title: "TypeScript", description: "Typed JavaScript — catching bugs before they ship.", topics: [
        { subject: "TypeScript", items: ["Types", "Interfaces", "Enums", "Generics", "Type Aliases", "Functions", "Classes", "Utility Types", "Type Narrowing", "React with TypeScript", "Modules", "Any vs Unknown", "Optional Chaining", "Type Guards", "Assertions", "Config", "Best Practices", "Errors", "Advanced Types", "Projects"] },
      ] },
      { title: "APIs", description: "Connecting your UI to real data.", topics: [
        { subject: "APIs", items: ["REST API", "GraphQL", "Fetch API", "Axios", "Authentication", "JWT", "OAuth", "CRUD", "Error Handling", "Pagination", "Caching", "Rate Limiting", "API Security", "Environment Variables", "WebSockets", "File Upload", "JSON", "Headers", "API Testing", "Best Practices"] },
      ] },
      { title: "Authentication", description: "Letting users securely sign in — and keeping them out where they shouldn't be.", topics: [
        { subject: "Authentication", items: ["JWT", "OAuth", "Session Authentication", "Cookies", "Firebase Auth", "Clerk", "Auth.js", "Protected Routes", "Refresh Tokens", "Social Login", "Role-Based Access", "Email Verification", "Password Reset", "Security", "MFA", "API Authentication", "Authentication Flow", "Best Practices", "Common Errors", "Projects"] },
      ] },
      { title: "Build Tools", description: "How your code turns into a fast, deployable bundle.", topics: [
        { subject: "Build Tools", items: ["Vite", "Webpack", "npm", "pnpm", "Yarn", "Babel", "ESLint", "Prettier", "Code Splitting", "Tree Shaking", "Bundling", "Hot Reload", "Environment Variables", "Aliases", "Plugins", "Source Maps", "Optimization", "CI/CD", "Deployment", "Best Practices"] },
      ] },
      { title: "Testing", description: "Confidence that your UI actually works, before your users find out otherwise.", topics: [
        { subject: "Testing", items: ["Jest", "Vitest", "Cypress", "Playwright", "React Testing Library", "Unit Testing", "Integration Testing", "E2E Testing", "Mocking", "Snapshot Testing", "Assertions", "Test Coverage", "API Testing", "Performance Testing", "Accessibility Testing", "Debugging", "CI Testing", "Best Practices", "Common Mistakes", "Projects"] },
      ] },
      { title: "Performance Optimization", description: "Making your app feel instant, not just work.", topics: [
        { subject: "Performance", items: ["Lazy Loading", "Image Optimization", "Code Splitting", "Memoization", "Bundle Analysis", "Lighthouse", "Caching", "Virtualization", "Web Vitals", "Compression", "Prefetching", "Preloading", "Rendering", "Suspense", "Performance Monitoring", "Fonts", "Animations", "SEO Performance", "Optimization Tools", "Best Practices"] },
      ] },
      { title: "Deployment", description: "Getting a real, working product live for real users.", topics: [
        { subject: "Deployment", items: ["Vercel", "Netlify", "AWS", "Cloudflare", "Docker", "GitHub Actions", "CI/CD", "Domain Setup", "SSL", "Environment Variables", "Build Process", "Logs", "Monitoring", "Analytics", "Performance", "Rollbacks", "Security", "CDN", "Hosting Comparison", "Best Practices"] },
      ] },
      { title: "Portfolio Projects", description: "Proof of skill — the projects that actually get you hired.", topics: [
        { subject: "Projects", items: ["Portfolio Website", "Todo App", "Weather App", "Netflix Clone", "Dashboard", "Chat App", "E-commerce", "Blog", "LMS", "AI SaaS", "Admin Panel", "Notes App", "Expense Tracker", "Food Delivery", "Social Media Clone", "Job Portal", "Kanban Board", "CRM", "Booking App", "Final Capstone"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview Prep", items: ["HTML Questions", "CSS Questions", "JavaScript Questions", "React Questions", "Next.js Questions", "TypeScript Questions", "Coding Round", "DSA Basics", "System Design Basics", "HR Questions", "Behavioral Questions", "Resume Discussion", "Portfolio Review", "Live Coding", "Debugging", "Communication", "Mock Interviews", "MNC Interview Tips", "Salary Negotiation", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career Growth", items: ["Resume Building", "ATS Optimization", "LinkedIn Profile", "GitHub Profile", "Networking", "Freelancing", "Remote Jobs", "Salary Negotiation", "Certifications", "Personal Branding", "Open Source", "Tech Blogs", "Conferences", "Mentorship", "Learning Plan", "Career Switching", "Productivity", "Time Management", "Continuous Learning", "Career Roadmap"] },
      ] },
      { title: "AI for Frontend Developers (2026+)", description: "Working alongside AI tools — the edge every modern frontend developer needs.", topics: [
        { subject: "AI Tools", items: ["GitHub Copilot", "ChatGPT", "Claude", "Cursor AI", "Windsurf", "v0 by Vercel", "Bolt.new", "Lovable", "Prompt Engineering", "AI Debugging", "AI Code Review", "AI UI Generation", "AI Testing", "AI Documentation", "AI Refactoring", "MCP Basics", "AI Agents", "AI Workflows", "Future Trends", "Best Practices"] },
      ] },
    ],
  },
  backend: {
    title: "Backend Developer",
    tagline: "A complete, in-depth path from language fundamentals to a job-ready, AI-fluent backend engineer.",
    steps: [
      { title: "Programming Language Fundamentals", description: "The language basics every backend role is built on.", topics: [
        { subject: "Languages", items: ["JavaScript (Node.js)", "Python", "Java", "C#", "Go", "PHP", "Variables", "Data Types", "Functions", "Loops", "OOP Basics", "Error Handling", "Modules", "Packages", "File Handling", "Memory Basics", "Collections", "Exceptions", "Coding Standards", "Best Practices"] },
      ] },
      { title: "Backend Fundamentals", description: "How servers, requests, and applications actually talk to each other.", topics: [
        { subject: "Backend Basics", items: ["Client-Server Architecture", "HTTP & HTTPS", "Request & Response", "REST Principles", "MVC Architecture", "Monolithic vs Microservices", "APIs", "Middleware", "Routing", "CRUD Operations", "Authentication Basics", "Authorization", "Sessions", "Cookies", "JSON", "XML", "Environment Variables", "Logging", "Error Handling", "Best Practices"] },
      ] },
      { title: "Databases", description: "Storing, modeling, and querying data reliably.", topics: [
        { subject: "Database", items: ["SQL", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "NoSQL", "Database Design", "Relationships", "Indexing", "Queries", "Joins", "Transactions", "Constraints", "Views", "Stored Procedures", "ORM", "Migrations", "Backup", "Optimization", "Best Practices"] },
      ] },
      { title: "APIs", description: "Designing endpoints other systems can actually rely on.", topics: [
        { subject: "API Development", items: ["REST API", "GraphQL", "CRUD APIs", "API Design", "Versioning", "Authentication", "JWT", "OAuth", "API Documentation", "Pagination", "Filtering", "Sorting", "Validation", "Rate Limiting", "Webhooks", "WebSockets", "gRPC", "Error Handling", "Testing APIs", "Best Practices"] },
      ] },
      { title: "Node.js / Express.js", description: "The most in-demand JavaScript backend stack.", topics: [
        { subject: "Node.js", items: ["Event Loop", "npm", "Modules", "Express.js", "Routing", "Middleware", "File Upload", "Authentication", "Error Handling", "Async Programming", "Streams", "Buffers", "Environment Variables", "Logging", "Security", "Validation", "ORM Integration", "APIs", "Deployment", "Best Practices"] },
      ] },
      { title: "Authentication & Authorization", description: "Proving who someone is, and controlling what they can do.", topics: [
        { subject: "Security", items: ["JWT", "OAuth", "Sessions", "Cookies", "Refresh Tokens", "Access Tokens", "RBAC", "Permissions", "Social Login", "Password Hashing", "bcrypt", "MFA", "Email Verification", "Password Reset", "Secure APIs", "CSRF", "CORS", "API Keys", "Security Headers", "Best Practices"] },
      ] },
      { title: "Version Control", description: "The shared workflow every real codebase runs on.", topics: [
        { subject: "Git", items: ["Git Basics", "Clone", "Commit", "Push", "Pull", "Branches", "Merge", "Rebase", "Cherry Pick", "GitHub", "Pull Requests", "Issues", "Releases", "Git Ignore", "Tags", "Actions", "Collaboration", "Conflict Resolution", "CI Basics", "Best Practices"] },
      ] },
      { title: "ORMs & Database Tools", description: "Working with your database without hand-writing every query.", topics: [
        { subject: "ORM", items: ["Prisma", "Sequelize", "TypeORM", "Mongoose", "Entity Relationships", "Schema", "Migration", "Seed Data", "Query Builder", "Transactions", "Validation", "Relations", "Optimization", "Performance", "Soft Delete", "Indexing", "Aggregation", "Raw Queries", "Backup", "Best Practices"] },
      ] },
      { title: "Caching", description: "Making repeated reads fast instead of hitting the database every time.", topics: [
        { subject: "Caching", items: ["Redis", "Memory Cache", "Browser Cache", "CDN", "Cache Headers", "Session Store", "Rate Limiting", "Queue Basics", "Pub/Sub", "Cache Invalidation", "TTL", "Performance", "Optimization", "Scaling", "Compression", "Best Practices", "Monitoring", "Distributed Cache", "Cache Patterns", "Use Cases"] },
      ] },
      { title: "Message Queues", description: "Decoupling work so your app stays fast under load.", topics: [
        { subject: "Queues", items: ["RabbitMQ", "Kafka", "BullMQ", "Redis Queue", "Background Jobs", "Scheduling", "Workers", "Retry Logic", "Delayed Jobs", "Event Driven Systems", "Notifications", "Email Queue", "Scaling", "Monitoring", "Logging", "Performance", "Dead Letter Queue", "Priority Queue", "Streams", "Best Practices"] },
      ] },
      { title: "Microservices", description: "Splitting a system into services that scale independently.", topics: [
        { subject: "Architecture", items: ["Monolith", "Microservices", "Service Discovery", "API Gateway", "Communication", "Events", "Scaling", "Docker", "Kubernetes Basics", "Monitoring", "Logging", "Fault Tolerance", "Circuit Breaker", "Load Balancing", "Messaging", "Security", "Deployment", "Versioning", "Distributed Systems", "Best Practices"] },
      ] },
      { title: "DevOps Basics", description: "The infrastructure skills every backend engineer eventually needs.", topics: [
        { subject: "DevOps", items: ["Linux", "Shell Commands", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Jenkins", "Nginx", "Reverse Proxy", "SSL", "Domains", "Hosting", "Monitoring", "Logging", "Scaling", "Automation", "Infrastructure Basics", "Secrets", "Containers", "Best Practices"] },
      ] },
      { title: "Cloud Computing", description: "Running and scaling your backend on real infrastructure.", topics: [
        { subject: "Cloud", items: ["AWS", "Azure", "GCP", "EC2", "S3", "Lambda", "Cloud Run", "Databases", "Networking", "IAM", "Storage", "CDN", "Monitoring", "Billing", "Security", "Deployment", "Serverless", "Functions", "Scaling", "Best Practices"] },
      ] },
      { title: "Backend Testing", description: "Confidence that your API actually does what it claims.", topics: [
        { subject: "Testing", items: ["Jest", "Mocha", "Supertest", "API Testing", "Postman", "Unit Testing", "Integration Testing", "E2E Testing", "Mocking", "Test Coverage", "Assertions", "Performance Testing", "Security Testing", "Load Testing", "Debugging", "CI Testing", "Automation", "Monitoring", "Logging", "Best Practices"] },
      ] },
      { title: "Performance Optimization", description: "Keeping response times fast as traffic grows.", topics: [
        { subject: "Performance", items: ["Database Optimization", "Indexing", "Query Optimization", "Caching", "Compression", "Pagination", "Lazy Loading", "Async Tasks", "Monitoring", "Profiling", "Logging", "Scaling", "CDN", "Rate Limiting", "Load Testing", "Optimization Tools", "Bottlenecks", "Memory Management", "CPU Optimization", "Best Practices"] },
      ] },
      { title: "Deployment", description: "Getting a real, working backend live for real users.", topics: [
        { subject: "Deployment", items: ["Vercel", "Railway", "Render", "AWS", "DigitalOcean", "Docker", "Nginx", "PM2", "CI/CD", "Domains", "SSL", "Monitoring", "Logging", "Scaling", "Rollback", "Environment Variables", "Backups", "Security", "Performance", "Best Practices"] },
      ] },
      { title: "Backend Projects", description: "Proof of skill — the systems that actually get you hired.", topics: [
        { subject: "Projects", items: ["REST API", "Authentication System", "Blog API", "E-commerce Backend", "Chat Backend", "LMS Backend", "CRM API", "Job Portal Backend", "Payment Integration", "File Storage API", "URL Shortener", "Social Media API", "Notification System", "Inventory System", "Booking System", "Banking API", "Hospital System", "AI API", "SaaS Backend", "Final Capstone"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Node.js Questions", "Express Questions", "SQL Questions", "MongoDB Questions", "System Design", "API Design", "Authentication", "Database Design", "Coding Questions", "Debugging", "HR Questions", "Behavioral Questions", "Resume Review", "Portfolio Discussion", "Live Coding", "Scalability", "Security", "Performance", "Salary Negotiation", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub Profile", "Open Source", "Freelancing", "Remote Jobs", "Personal Branding", "Networking", "Certifications", "System Design", "Tech Blogs", "Conferences", "Mentorship", "Career Switching", "Productivity", "Leadership", "Time Management", "Continuous Learning", "Salary Negotiation", "Career Roadmap"] },
      ] },
      { title: "AI for Backend Developers (2026+)", description: "Working alongside AI tools — the edge every modern backend developer needs.", topics: [
        { subject: "AI", items: ["GitHub Copilot", "ChatGPT", "Claude", "Cursor AI", "Windsurf", "MCP Servers", "AI API Integration", "AI Code Review", "AI Debugging", "Prompt Engineering", "AI Documentation", "AI Testing", "AI Refactoring", "AI Database Design", "AI Architecture Assistant", "AI Agents", "LangChain Basics", "OpenAI API", "Vector Databases", "AI Best Practices"] },
      ] },
    ],
  },
  "full-stack": {
    title: "Full Stack Developer",
    tagline: "A complete, in-depth path from programming fundamentals to an MNC-ready full stack engineer.",
    steps: [
      { title: "Programming Fundamentals", description: "The logic and problem-solving skills every language builds on.", topics: [
        { subject: "Programming Basics", items: ["Computer Fundamentals", "Problem Solving", "Variables & Data Types", "Operators", "Control Flow", "Functions", "Arrays", "Objects", "OOP Basics", "Error Handling", "Modules", "File Handling", "Algorithms Basics", "Data Structures Basics", "Debugging", "Coding Standards", "Best Practices", "IDE Setup", "Command Line Basics", "Programming Logic"] },
      ] },
      { title: "HTML & CSS Fundamentals", description: "The structure and styling every browser renders.", topics: [
        { subject: "Frontend Basics", items: ["HTML5", "Semantic HTML", "Forms", "Tables", "SEO Basics", "Accessibility", "CSS Selectors", "Box Model", "Flexbox", "CSS Grid", "Positioning", "Responsive Design", "Media Queries", "Animations", "Transitions", "CSS Variables", "Tailwind CSS", "Bootstrap", "Dark Mode", "Best Practices"] },
      ] },
      { title: "JavaScript Essentials", description: "The language that makes both the browser and the server work.", topics: [
        { subject: "JavaScript", items: ["Variables", "Functions", "Arrays", "Objects", "DOM Manipulation", "Events", "ES6+", "Async/Await", "Promises", "Fetch API", "Modules", "Local Storage", "Closures", "Hoisting", "Event Loop", "Higher Order Functions", "Error Handling", "Optional Chaining", "Destructuring", "Best Practices"] },
      ] },
      { title: "Version Control (Git & GitHub)", description: "The shared workflow every real codebase runs on.", topics: [
        { subject: "Git", items: ["Git Basics", "GitHub", "Clone", "Commit", "Push", "Pull", "Branches", "Merge", "Rebase", "Pull Requests", "Git Ignore", "Tags", "Releases", "GitHub Actions", "Collaboration", "Conflict Resolution", "Fork", "Cherry Pick", "CI Basics", "Best Practices"] },
      ] },
      { title: "Frontend Framework", description: "Building real UIs with React and its ecosystem.", topics: [
        { subject: "React Ecosystem", items: ["React.js", "Components", "JSX", "Props", "State", "Hooks", "Routing", "Forms", "Context API", "API Integration", "Conditional Rendering", "Performance", "Lazy Loading", "Suspense", "Error Boundaries", "Next.js", "TypeScript", "Folder Structure", "Testing", "Best Practices"] },
      ] },
      { title: "Backend Development", description: "The server-side logic powering your frontend.", topics: [
        { subject: "Backend", items: ["Node.js", "Express.js", "REST APIs", "CRUD Operations", "Routing", "Middleware", "Authentication", "Authorization", "MVC Architecture", "Error Handling", "File Upload", "Validation", "Logging", "Environment Variables", "API Documentation", "Rate Limiting", "Security", "WebSockets", "Background Jobs", "Best Practices"] },
      ] },
      { title: "Database Management", description: "Modeling and querying the data your app runs on.", topics: [
        { subject: "Databases", items: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Database Design", "Relationships", "Queries", "Joins", "Indexing", "Transactions", "ORM (Prisma)", "Migrations", "Seed Data", "Constraints", "Aggregation", "Backup", "Performance", "Optimization", "Security", "Best Practices"] },
      ] },
      { title: "APIs & Integrations", description: "Connecting your app to the outside world.", topics: [
        { subject: "API Development", items: ["REST APIs", "GraphQL", "Axios", "Fetch API", "JSON", "JWT", "OAuth", "API Security", "Pagination", "Filtering", "Sorting", "Validation", "Rate Limiting", "Webhooks", "WebSockets", "Third-party APIs", "API Documentation", "API Testing", "Versioning", "Best Practices"] },
      ] },
      { title: "Authentication & Security", description: "Locking things down properly, front to back.", topics: [
        { subject: "Security", items: ["JWT", "OAuth", "Sessions", "Cookies", "bcrypt", "RBAC", "Social Login", "Email Verification", "Password Reset", "MFA", "API Security", "CSRF", "CORS", "Helmet", "Secure Headers", "XSS Protection", "SQL Injection Prevention", "Secrets Management", "Security Testing", "Best Practices"] },
      ] },
      { title: "State Management", description: "Keeping data consistent across a growing app.", topics: [
        { subject: "State", items: ["Context API", "Redux Toolkit", "Zustand", "Recoil", "Global State", "Local State", "Reducers", "Middleware", "Async State", "Selectors", "Performance", "DevTools", "Persistence", "Folder Structure", "Optimization", "Derived State", "Server State", "React Query", "Caching", "Best Practices"] },
      ] },
      { title: "DevOps Fundamentals", description: "Running and shipping your app reliably.", topics: [
        { subject: "DevOps", items: ["Linux", "Docker", "Kubernetes Basics", "GitHub Actions", "CI/CD", "Jenkins", "Nginx", "Reverse Proxy", "PM2", "Environment Variables", "Logging", "Monitoring", "SSL", "Domains", "Automation", "Secrets", "Containers", "Deployment Strategy", "Scaling", "Best Practices"] },
      ] },
      { title: "Cloud Computing", description: "Hosting infrastructure that scales beyond your laptop.", topics: [
        { subject: "Cloud", items: ["AWS", "Azure", "Google Cloud", "EC2", "S3", "Lambda", "Cloud Run", "Firebase", "Supabase", "Vercel", "Netlify", "Railway", "Render", "CDN", "IAM", "Monitoring", "Storage", "Networking", "Serverless", "Best Practices"] },
      ] },
      { title: "Testing", description: "Confidence that your full stack app actually works.", topics: [
        { subject: "Testing", items: ["Jest", "Vitest", "React Testing Library", "Cypress", "Playwright", "Unit Testing", "Integration Testing", "E2E Testing", "API Testing", "Mocking", "Assertions", "Snapshot Testing", "Performance Testing", "Security Testing", "Load Testing", "CI Testing", "Debugging", "Test Coverage", "Automation", "Best Practices"] },
      ] },
      { title: "Performance Optimization", description: "Making the whole stack feel fast, not just look fast.", topics: [
        { subject: "Performance", items: ["Code Splitting", "Lazy Loading", "Image Optimization", "Caching", "Compression", "Bundle Analysis", "Lighthouse", "Web Vitals", "Database Optimization", "Query Optimization", "Memoization", "CDN", "Virtualization", "Rendering", "Monitoring", "Profiling", "Memory Optimization", "SEO Performance", "Scaling", "Best Practices"] },
      ] },
      { title: "Deployment & Production", description: "Getting a real, working product live for real users.", topics: [
        { subject: "Deployment", items: ["Docker", "Vercel", "Railway", "Render", "AWS", "DigitalOcean", "Nginx", "PM2", "CI/CD", "SSL", "Domain Setup", "Environment Variables", "Monitoring", "Logging", "Rollbacks", "Backups", "Scaling", "Security", "Production Checklist", "Best Practices"] },
      ] },
      { title: "Full Stack Projects", description: "Proof of skill — the projects that actually get you hired.", topics: [
        { subject: "Projects", items: ["Portfolio Website", "Blog CMS", "Authentication System", "E-commerce Website", "Learning Management System", "Chat Application", "Video Streaming Platform", "Food Delivery App", "CRM Dashboard", "Job Portal", "Hospital Management", "Social Media App", "SaaS Application", "AI Dashboard", "Finance Tracker", "Project Management Tool", "Inventory System", "Booking System", "ERP Mini Project", "Final Capstone Project"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["HTML Questions", "CSS Questions", "JavaScript Questions", "React Questions", "Node.js Questions", "Express Questions", "SQL Questions", "MongoDB Questions", "System Design", "API Design", "Authentication", "Coding Round", "DSA Basics", "HR Questions", "Behavioral Questions", "Live Coding", "Debugging", "Resume Review", "Salary Negotiation", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub Profile", "Portfolio Website", "Open Source", "Freelancing", "Remote Jobs", "Personal Branding", "Certifications", "Networking", "Tech Blogging", "Conferences", "Mentorship", "Career Switching", "Productivity", "Leadership", "Time Management", "Continuous Learning", "Salary Negotiation", "Career Roadmap"] },
      ] },
      { title: "AI for Full Stack Developers", description: "Working alongside AI tools — the edge every modern full stack developer needs.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "GitHub Copilot", "Cursor AI", "Windsurf", "v0 by Vercel", "Bolt.new", "Lovable", "Prompt Engineering", "AI UI Generation", "AI Backend Development", "AI API Integration", "AI Debugging", "AI Testing", "AI Documentation", "AI Code Review", "MCP Servers", "AI Agents", "LangChain Basics", "Best Practices"] },
      ] },
      { title: "Becoming an MNC-Ready Full Stack Developer", description: "The final layer — system design, communication, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["DSA Fundamentals", "System Design Basics", "Low-Level Design Basics", "High-Level Design Basics", "Communication Skills", "Problem Solving", "Team Collaboration", "Agile & Scrum", "Jira", "Technical Documentation", "Code Reviews", "Git Workflow", "Design Patterns", "Clean Code", "Portfolio Review", "Mock Interviews", "FAANG Preparation", "Salary Negotiation", "Career Planning", "30-60-90 Day Action Plan"] },
      ] },
    ],
  },
  ai: {
    title: "AI Engineer",
    tagline: "A complete, in-depth path from CS fundamentals to a job-ready AI engineer at top companies.",
    steps: [
      { title: "Computer Science Fundamentals", description: "The foundation every engineering discipline is built on.", topics: [
        { subject: "CS Basics", items: ["Computer Fundamentals", "Operating Systems", "Networking Basics", "Data Structures", "Algorithms", "Object-Oriented Programming", "Problem Solving", "Time Complexity", "Space Complexity", "Design Patterns", "Git Basics", "Linux Basics", "Command Line", "Debugging", "Software Engineering Principles", "Clean Code", "Version Control", "SDLC", "Agile Basics", "Best Practices"] },
      ] },
      { title: "Python Programming", description: "The default language of AI development.", topics: [
        { subject: "Python", items: ["Variables", "Data Types", "Loops", "Functions", "OOP", "Modules", "File Handling", "Exception Handling", "List Comprehension", "Generators", "Decorators", "Lambda Functions", "Virtual Environments", "Pip", "NumPy Basics", "Pandas Basics", "Logging", "Testing", "Best Practices", "Python Projects"] },
      ] },
      { title: "Mathematics for AI", description: "Enough math to understand what a model is actually doing.", topics: [
        { subject: "Mathematics", items: ["Linear Algebra", "Matrices", "Vectors", "Calculus Basics", "Derivatives", "Probability", "Statistics", "Bayes Theorem", "Mean & Variance", "Correlation", "Distributions", "Optimization", "Gradient Descent", "Eigenvalues", "Eigenvectors", "Sampling", "Hypothesis Testing", "Feature Scaling", "Loss Functions", "Best Practices"] },
      ] },
      { title: "Data Analysis", description: "Understanding your data before you model it.", topics: [
        { subject: "Data Analytics", items: ["NumPy", "Pandas", "Data Cleaning", "Missing Values", "Data Visualization", "Matplotlib", "Seaborn", "Plotly", "Data Wrangling", "EDA", "Feature Engineering", "Outlier Detection", "Data Pipelines", "CSV/Excel", "SQL Integration", "Reporting", "Dashboards", "Best Practices", "Case Studies", "Projects"] },
      ] },
      { title: "SQL & Databases", description: "Where the data an AI system trains on actually lives.", topics: [
        { subject: "Databases", items: ["SQL Basics", "PostgreSQL", "MySQL", "SQLite", "MongoDB", "CRUD", "Joins", "Indexing", "Aggregation", "Views", "Stored Procedures", "Window Functions", "Optimization", "Transactions", "Database Design", "ORM Basics", "Data Warehousing", "Backup", "Security", "Best Practices"] },
      ] },
      { title: "Machine Learning", description: "The core algorithms behind every predictive system.", topics: [
        { subject: "Machine Learning", items: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Regression", "Classification", "Clustering", "Decision Trees", "Random Forest", "SVM", "KNN", "Naive Bayes", "Ensemble Methods", "Model Evaluation", "Cross Validation", "Feature Selection", "Hyperparameter Tuning", "Scikit-learn", "Pipelines", "ML Projects", "Best Practices"] },
      ] },
      { title: "Deep Learning", description: "Neural networks, from a single neuron to modern architectures.", topics: [
        { subject: "Deep Learning", items: ["Neural Networks", "Perceptron", "Activation Functions", "Forward Propagation", "Backpropagation", "CNN", "RNN", "LSTM", "GRU", "Transformers", "Attention Mechanism", "Transfer Learning", "Fine-tuning", "TensorFlow", "Keras", "PyTorch", "GPU Training", "Model Optimization", "Projects", "Best Practices"] },
      ] },
      { title: "Natural Language Processing (NLP)", description: "Teaching models to understand and generate language.", topics: [
        { subject: "NLP", items: ["Text Processing", "Tokenization", "Embeddings", "Word2Vec", "GloVe", "BERT", "GPT", "Transformers", "Hugging Face", "Text Classification", "Named Entity Recognition", "Sentiment Analysis", "Question Answering", "Chatbots", "Prompt Engineering", "Fine-tuning LLMs", "RAG Basics", "Vector Embeddings", "NLP Projects", "Best Practices"] },
      ] },
      { title: "Computer Vision", description: "Teaching models to understand images and video.", topics: [
        { subject: "Computer Vision", items: ["OpenCV", "Image Processing", "Image Classification", "Object Detection", "YOLO", "Face Recognition", "OCR", "Image Segmentation", "CNN", "Transfer Learning", "Image Augmentation", "Video Processing", "Pose Detection", "Tracking", "Medical Imaging", "TensorFlow Vision", "PyTorch Vision", "Vision Projects", "Deployment", "Best Practices"] },
      ] },
      { title: "Generative AI & LLMs", description: "Building on top of the large language models powering AI right now.", topics: [
        { subject: "Generative AI", items: ["Large Language Models", "GPT Models", "Claude", "Gemini", "Llama", "Mistral", "Prompt Engineering", "Prompt Chaining", "RAG", "Embeddings", "Vector Databases", "Fine-Tuning", "AI Agents", "MCP Basics", "LangChain", "LangGraph", "CrewAI", "AutoGen", "AI Projects", "Best Practices"] },
      ] },
      { title: "AI Frameworks", description: "The tools every production AI team actually uses.", topics: [
        { subject: "Frameworks", items: ["TensorFlow", "PyTorch", "Keras", "Hugging Face", "Scikit-learn", "LangChain", "LangGraph", "CrewAI", "Haystack", "MLflow", "ONNX", "Ray", "FastAPI", "Streamlit", "Gradio", "OpenCV", "FAISS", "ChromaDB", "Ollama", "Best Practices"] },
      ] },
      { title: "MLOps", description: "Running AI systems reliably, not just training them once.", topics: [
        { subject: "MLOps", items: ["ML Lifecycle", "Data Pipelines", "Model Versioning", "DVC", "MLflow", "Docker", "Kubernetes", "CI/CD", "Model Deployment", "Monitoring", "Drift Detection", "Retraining", "Feature Store", "Airflow", "Kubeflow", "Logging", "Scaling", "Security", "Automation", "Best Practices"] },
      ] },
      { title: "Cloud for AI", description: "Training and serving models on real infrastructure.", topics: [
        { subject: "Cloud", items: ["AWS SageMaker", "Azure AI", "Google Vertex AI", "Cloud Storage", "GPUs", "Serverless AI", "Docker", "Kubernetes", "APIs", "Deployment", "Monitoring", "IAM", "Security", "Billing", "CDN", "Scaling", "AI APIs", "Networking", "DevOps Basics", "Best Practices"] },
      ] },
      { title: "AI Deployment", description: "Turning a trained model into a product people can actually use.", topics: [
        { subject: "Deployment", items: ["FastAPI", "Flask", "Docker", "Streamlit", "Gradio", "REST APIs", "Model Serving", "Inference", "Scaling", "Monitoring", "Authentication", "Rate Limiting", "CI/CD", "Logging", "Performance", "Security", "Cloud Deployment", "Versioning", "Rollback", "Best Practices"] },
      ] },
      { title: "AI Projects", description: "Proof of skill — the systems that actually get you hired.", topics: [
        { subject: "Projects", items: ["AI Chatbot", "Resume Analyzer", "Document Summarizer", "AI Search Engine", "RAG Application", "AI Career Coach", "AI Interview Assistant", "Recommendation System", "Image Classifier", "Object Detection", "Voice Assistant", "AI Email Assistant", "AI Agent", "OCR System", "Sentiment Analyzer", "AI Code Reviewer", "AI SaaS", "Healthcare AI", "Finance AI", "Final Capstone"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Python Questions", "SQL Questions", "Machine Learning", "Deep Learning", "NLP", "LLM Questions", "Statistics", "Probability", "System Design", "AI Case Studies", "Coding Round", "HR Questions", "Research Papers", "Model Evaluation", "AI Ethics", "Prompt Engineering", "MLOps", "Resume Review", "Salary Negotiation", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "AI Portfolio", "GitHub", "Kaggle", "Hugging Face Profile", "LinkedIn", "Research Papers", "Open Source", "AI Communities", "Conferences", "Networking", "Certifications", "Personal Branding", "Freelancing", "Startup Opportunities", "Remote Jobs", "Mentorship", "Productivity", "Career Roadmap", "Best Practices"] },
      ] },
      { title: "AI Tools & Productivity", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "Gemini", "GitHub Copilot", "Cursor AI", "Windsurf", "NotebookLM", "Perplexity", "Grok", "v0", "Bolt.new", "Lovable", "ElevenLabs", "Midjourney", "Stable Diffusion", "Runway", "OpenRouter", "Ollama", "LM Studio", "Best Practices"] },
      ] },
      { title: "AI Ethics & Security", description: "Building AI responsibly — bias, privacy, and safety.", topics: [
        { subject: "Responsible AI", items: ["AI Ethics", "Bias & Fairness", "Explainable AI (XAI)", "Privacy", "GDPR Basics", "Responsible AI", "AI Safety", "Hallucinations", "Prompt Injection", "Model Security", "Data Security", "Copyright", "Deepfakes", "AI Governance", "Compliance", "Human Oversight", "Risk Assessment", "Secure AI Systems", "Case Studies", "Best Practices"] },
      ] },
      { title: "Becoming an AI Engineer at Top Companies", description: "The final layer — system design, communication, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["AI Portfolio", "Kaggle Competitions", "Open Source Contributions", "Research Papers", "AI System Design", "LLM Projects", "AI Resume", "Technical Interviews", "Coding Challenges", "Communication Skills", "Problem Solving", "AI Case Studies", "Mock Interviews", "Salary Negotiation", "Career Planning", "FAANG AI Preparation", "Startup vs MNC", "Building Personal Brand", "30-60-90 Day Learning Plan", "Final Career Checklist"] },
      ] },
    ],
  },
  ml: {
    title: "Machine Learning Engineer",
    tagline: "A complete, in-depth path from CS fundamentals to an ML engineer at top companies.",
    steps: [
      { title: "Computer Science Fundamentals", description: "The foundation every engineering discipline is built on.", topics: [
        { subject: "CS Basics", items: ["Computer Fundamentals", "Operating Systems", "Networking Basics", "Data Structures", "Algorithms", "Object-Oriented Programming", "Problem Solving", "Time & Space Complexity", "Linux Basics", "Git Basics", "Debugging", "Software Engineering", "SDLC", "Design Patterns", "Command Line", "Coding Standards", "Version Control", "Agile Basics", "System Thinking", "Best Practices"] },
      ] },
      { title: "Python for Machine Learning", description: "The working language behind almost every ML pipeline.", topics: [
        { subject: "Python", items: ["Variables", "Data Types", "Functions", "OOP", "Loops", "Modules", "File Handling", "Exception Handling", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Virtual Environment", "Pip", "Logging", "Testing", "List Comprehension", "Lambda", "Decorators", "Best Practices"] },
      ] },
      { title: "Mathematics for Machine Learning", description: "The math underneath every algorithm you'll use.", topics: [
        { subject: "Mathematics", items: ["Linear Algebra", "Matrices", "Vectors", "Probability", "Statistics", "Calculus", "Derivatives", "Gradient Descent", "Optimization", "Correlation", "Covariance", "Eigenvalues", "Eigenvectors", "Distributions", "Hypothesis Testing", "Bayesian Probability", "Sampling", "Feature Scaling", "Loss Functions", "Best Practices"] },
      ] },
      { title: "Data Analysis & Visualization", description: "Understanding your data before you ever train a model.", topics: [
        { subject: "Data Analytics", items: ["NumPy", "Pandas", "Data Cleaning", "Missing Values", "Feature Engineering", "EDA", "Data Visualization", "Matplotlib", "Seaborn", "Plotly", "Outlier Detection", "Data Transformation", "Data Pipelines", "Reporting", "Dashboards", "Time Series Basics", "CSV/Excel", "SQL Integration", "Data Quality", "Best Practices"] },
      ] },
      { title: "SQL & Databases", description: "Where the data your models train on actually lives.", topics: [
        { subject: "Databases", items: ["SQL Basics", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "CRUD", "Joins", "Aggregations", "Indexing", "Window Functions", "Views", "Stored Procedures", "Transactions", "Database Design", "Optimization", "ORM Basics", "Data Warehousing", "Backup", "Security", "Best Practices"] },
      ] },
      { title: "Machine Learning Fundamentals", description: "The core algorithm families every ML engineer must know cold.", topics: [
        { subject: "Machine Learning", items: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Regression", "Classification", "Clustering", "KNN", "Decision Trees", "Random Forest", "SVM", "Naive Bayes", "Ensemble Learning", "Model Evaluation", "Cross Validation", "Hyperparameter Tuning", "Feature Selection", "Scikit-learn", "Pipelines", "ML Workflow", "Best Practices"] },
      ] },
      { title: "Feature Engineering", description: "Turning raw data into what a model can actually learn from.", topics: [
        { subject: "Feature Engineering", items: ["Data Encoding", "Scaling", "Normalization", "Standardization", "Missing Data", "Feature Selection", "Feature Extraction", "PCA", "Dimensionality Reduction", "Data Balancing", "SMOTE", "Polynomial Features", "Binning", "Time Features", "Text Features", "Image Features", "Date Features", "Feature Importance", "Pipelines", "Best Practices"] },
      ] },
      { title: "Deep Learning Basics", description: "Neural networks for problems classic ML can't solve well.", topics: [
        { subject: "Deep Learning", items: ["Neural Networks", "Activation Functions", "Forward Propagation", "Backpropagation", "CNN", "RNN", "LSTM", "GRU", "Transformers Basics", "TensorFlow", "Keras", "PyTorch", "GPU Training", "Loss Functions", "Optimizers", "Batch Normalization", "Dropout", "Transfer Learning", "Fine-Tuning", "Best Practices"] },
      ] },
      { title: "Natural Language Processing", description: "Building models that work with text.", topics: [
        { subject: "NLP", items: ["Tokenization", "Text Cleaning", "Embeddings", "TF-IDF", "Word2Vec", "GloVe", "BERT", "GPT Basics", "Transformers", "Hugging Face", "Text Classification", "Sentiment Analysis", "Named Entity Recognition", "Chatbots", "Summarization", "Question Answering", "Translation", "Vector Embeddings", "NLP Projects", "Best Practices"] },
      ] },
      { title: "Computer Vision", description: "Building models that work with images and video.", topics: [
        { subject: "Computer Vision", items: ["OpenCV", "Image Processing", "Image Classification", "Object Detection", "YOLO", "OCR", "Face Recognition", "Image Segmentation", "CNN", "Video Processing", "Pose Detection", "Tracking", "Data Augmentation", "Medical Imaging", "Vision Transformers", "PyTorch Vision", "TensorFlow Vision", "Vision Projects", "Deployment", "Best Practices"] },
      ] },
      { title: "MLOps", description: "Running models reliably in production, not just in a notebook.", topics: [
        { subject: "MLOps", items: ["ML Lifecycle", "Model Versioning", "MLflow", "DVC", "Docker", "Kubernetes", "Airflow", "Kubeflow", "CI/CD", "Model Deployment", "Monitoring", "Drift Detection", "Retraining", "Feature Store", "Logging", "Automation", "Experiment Tracking", "Pipelines", "Scaling", "Best Practices"] },
      ] },
      { title: "Cloud for ML", description: "Training and serving models on real infrastructure.", topics: [
        { subject: "Cloud", items: ["AWS SageMaker", "Google Vertex AI", "Azure ML", "EC2", "S3", "Lambda", "Cloud Storage", "GPUs", "Docker", "Kubernetes", "Serverless", "Monitoring", "IAM", "APIs", "Deployment", "Networking", "Billing", "CDN", "Security", "Best Practices"] },
      ] },
      { title: "Model Deployment", description: "Serving predictions through an API production systems can call.", topics: [
        { subject: "Deployment", items: ["FastAPI", "Flask", "Streamlit", "Gradio", "Docker", "REST APIs", "Model Serving", "Inference", "Authentication", "Monitoring", "Logging", "Versioning", "Rollback", "Performance", "Security", "Cloud Deployment", "Scaling", "CI/CD", "Optimization", "Best Practices"] },
      ] },
      { title: "ML Projects", description: "Proof of skill — the systems that actually get you hired.", topics: [
        { subject: "Projects", items: ["House Price Prediction", "Spam Detection", "Movie Recommendation", "Customer Churn", "Fraud Detection", "Sales Forecasting", "Credit Risk Prediction", "Stock Prediction", "Medical Diagnosis", "Sentiment Analysis", "Chatbot", "Resume Screening", "Face Detection", "Image Classifier", "OCR System", "AI Recommendation Engine", "Predictive Analytics Dashboard", "ML SaaS", "End-to-End ML Pipeline", "Final Capstone"] },
      ] },
      { title: "Model Optimization", description: "Making models faster, smaller, and more explainable.", topics: [
        { subject: "Optimization", items: ["Hyperparameter Tuning", "Grid Search", "Random Search", "Bayesian Optimization", "Ensemble Models", "Cross Validation", "Model Compression", "Quantization", "Distillation", "Explainable AI", "SHAP", "LIME", "Drift Detection", "Monitoring", "Performance Metrics", "Inference Optimization", "GPU Optimization", "Cost Optimization", "Scaling", "Best Practices"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Python Questions", "SQL Questions", "Statistics", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "MLOps", "System Design", "Coding Questions", "HR Questions", "Behavioral Questions", "Resume Review", "Live Coding", "Case Studies", "Model Evaluation", "Deployment Questions", "Salary Negotiation", "Mock Interviews", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub", "Kaggle", "Portfolio", "Open Source", "Research Papers", "Networking", "Certifications", "Conferences", "Personal Branding", "Freelancing", "Remote Jobs", "Startup Opportunities", "Mentorship", "Productivity", "Time Management", "Career Planning", "Continuous Learning", "Best Practices"] },
      ] },
      { title: "AI Tools for ML Engineers", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "GitHub Copilot", "Cursor AI", "Gemini", "Perplexity", "NotebookLM", "Hugging Face", "Kaggle", "MLflow", "DVC", "LangChain Basics", "Ollama", "LM Studio", "OpenRouter", "Weights & Biases", "TensorBoard", "VS Code AI Extensions", "Prompt Engineering", "Best Practices"] },
      ] },
      { title: "AI Ethics & Responsible ML", description: "Building models responsibly — bias, privacy, and safety.", topics: [
        { subject: "Responsible ML", items: ["Explainable AI", "Bias Detection", "Fairness", "Privacy", "GDPR Basics", "Responsible AI", "Model Security", "Data Security", "Hallucinations", "Adversarial ML", "AI Governance", "Human Oversight", "Risk Assessment", "Compliance", "Deepfake Awareness", "Ethical Case Studies", "Copyright", "AI Safety", "Secure ML Systems", "Best Practices"] },
      ] },
      { title: "Becoming an ML Engineer at Top Companies", description: "The final layer — system design, communication, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["ML Portfolio", "Kaggle Competitions", "Open Source", "Research Papers", "ML System Design", "AI Resume", "Technical Interviews", "Coding Challenges", "Communication Skills", "Problem Solving", "Business Case Studies", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Building Personal Brand", "LinkedIn Optimization", "Networking", "30-60-90 Day Learning Plan", "Final Career Checklist"] },
      ] },
    ],
  },
  "data-science": {
    title: "Data Scientist",
    tagline: "A complete, in-depth path from CS fundamentals to a data scientist at top companies.",
    steps: [
      { title: "Computer Science Fundamentals", description: "The foundation every engineering discipline is built on.", topics: [
        { subject: "CS Basics", items: ["Computer Fundamentals", "Operating Systems", "Networking Basics", "Data Structures", "Algorithms", "Object-Oriented Programming", "Problem Solving", "Time Complexity", "Space Complexity", "Git Basics", "Linux Basics", "Command Line", "Software Engineering", "SDLC", "Debugging", "Clean Code", "Version Control", "Agile Basics", "Programming Logic", "Best Practices"] },
      ] },
      { title: "Python Programming", description: "The working language behind almost every data science workflow.", topics: [
        { subject: "Python", items: ["Variables", "Data Types", "Loops", "Functions", "OOP", "Modules", "File Handling", "Exception Handling", "NumPy", "Pandas", "Virtual Environment", "Pip", "Logging", "Lambda Functions", "Decorators", "List Comprehension", "Testing", "APIs", "Python Projects", "Best Practices"] },
      ] },
      { title: "Mathematics & Statistics", description: "The analytical toolkit behind every finding you'll report.", topics: [
        { subject: "Math & Stats", items: ["Linear Algebra", "Probability", "Statistics", "Mean", "Median", "Mode", "Variance", "Standard Deviation", "Correlation", "Covariance", "Hypothesis Testing", "Bayes Theorem", "Normal Distribution", "Sampling", "Confidence Interval", "Regression", "Optimization", "Gradient Descent", "Loss Functions", "Best Practices"] },
      ] },
      { title: "SQL & Databases", description: "Where the data you'll analyze actually lives.", topics: [
        { subject: "Database", items: ["SQL Basics", "MySQL", "PostgreSQL", "SQLite", "MongoDB", "CRUD", "Joins", "Aggregation", "Window Functions", "Views", "Indexing", "Stored Procedures", "Transactions", "Database Design", "Optimization", "Data Warehousing", "ETL Basics", "Backup", "Security", "Best Practices"] },
      ] },
      { title: "Data Analysis", description: "Cleaning messy, real-world data into something you can actually analyze.", topics: [
        { subject: "Data Analysis", items: ["NumPy", "Pandas", "Data Cleaning", "Missing Values", "Data Transformation", "Feature Engineering", "Data Wrangling", "Exploratory Data Analysis", "Outlier Detection", "Duplicate Handling", "Time Series Basics", "Data Validation", "Data Pipelines", "Data Profiling", "Business Metrics", "Reporting", "Data Storytelling", "Automation", "Case Studies", "Best Practices"] },
      ] },
      { title: "Data Visualization", description: "Making findings clear to non-technical stakeholders.", topics: [
        { subject: "Visualization", items: ["Matplotlib", "Seaborn", "Plotly", "Power BI", "Tableau", "Dashboards", "Charts", "KPI Reporting", "Storytelling", "Interactive Reports", "Business Reports", "Heatmaps", "Scatter Plots", "Histograms", "Pie Charts", "Time Series Charts", "Geo Maps", "Visualization Best Practices", "Executive Reports", "Case Studies"] },
      ] },
      { title: "Machine Learning Fundamentals", description: "Building predictive models on top of your analysis.", topics: [
        { subject: "Machine Learning", items: ["Supervised Learning", "Unsupervised Learning", "Regression", "Classification", "Clustering", "Decision Trees", "Random Forest", "SVM", "KNN", "Naive Bayes", "Ensemble Learning", "Model Evaluation", "Cross Validation", "Hyperparameter Tuning", "Scikit-learn", "Feature Selection", "Model Pipeline", "ML Workflow", "Model Comparison", "Best Practices"] },
      ] },
      { title: "Feature Engineering", description: "Turning raw data into what a model can actually learn from.", topics: [
        { subject: "Feature Engineering", items: ["Missing Data", "Encoding", "Scaling", "Normalization", "Standardization", "Feature Selection", "Feature Extraction", "PCA", "Dimensionality Reduction", "Polynomial Features", "SMOTE", "Data Balancing", "Time Features", "Date Features", "Text Features", "Image Features", "Feature Importance", "Pipelines", "Automation", "Best Practices"] },
      ] },
      { title: "Deep Learning Basics", description: "Neural networks for the problems classic ML can't solve well.", topics: [
        { subject: "Deep Learning", items: ["Neural Networks", "CNN", "RNN", "LSTM", "Transformers", "TensorFlow", "PyTorch", "Keras", "Transfer Learning", "Fine-Tuning", "GPU Training", "Optimizers", "Loss Functions", "Batch Normalization", "Dropout", "Image Models", "NLP Models", "Model Evaluation", "Projects", "Best Practices"] },
      ] },
      { title: "Business Intelligence (BI)", description: "Turning data into decisions the business actually acts on.", topics: [
        { subject: "Business Intelligence", items: ["KPI Design", "Business Metrics", "Data Warehousing", "ETL", "Dashboard Design", "Reporting", "Power BI", "Tableau", "Excel Advanced", "SQL Analytics", "Decision Making", "Forecasting", "Trend Analysis", "Customer Analytics", "Sales Analytics", "Marketing Analytics", "Financial Analytics", "HR Analytics", "Executive Reporting", "Best Practices"] },
      ] },
      { title: "Big Data", description: "Working with data that no longer fits on one machine.", topics: [
        { subject: "Big Data", items: ["Hadoop", "Spark", "PySpark", "Hive", "Kafka", "Data Lakes", "Data Warehouse", "Distributed Computing", "Batch Processing", "Stream Processing", "HDFS", "Data Pipelines", "Airflow", "Data Engineering Basics", "ETL", "Scalability", "Monitoring", "Performance", "Cloud Storage", "Best Practices"] },
      ] },
      { title: "Cloud for Data Science", description: "Running analytics and models on real infrastructure.", topics: [
        { subject: "Cloud", items: ["AWS", "Azure", "Google Cloud", "BigQuery", "Redshift", "Snowflake", "S3", "Cloud Storage", "SageMaker", "Vertex AI", "Databricks", "Docker", "APIs", "Monitoring", "Security", "IAM", "Serverless", "Networking", "Billing", "Best Practices"] },
      ] },
      { title: "Model Deployment", description: "Getting your model into a real, usable service.", topics: [
        { subject: "Deployment", items: ["Flask", "FastAPI", "Streamlit", "Gradio", "REST APIs", "Docker", "Cloud Deployment", "Authentication", "Monitoring", "Logging", "Versioning", "CI/CD", "Scaling", "Performance", "Security", "Rollback", "Model Serving", "Automation", "Production ML", "Best Practices"] },
      ] },
      { title: "Data Science Projects", description: "Proof of skill — the projects that actually get you hired.", topics: [
        { subject: "Projects", items: ["Sales Forecasting", "Customer Churn Prediction", "Recommendation System", "Fraud Detection", "Credit Risk Analysis", "House Price Prediction", "Sentiment Analysis", "Demand Forecasting", "HR Analytics", "Marketing Analytics", "Healthcare Analytics", "Financial Dashboard", "AI Chatbot", "Resume Analyzer", "NLP Project", "Time Series Forecasting", "Stock Prediction", "AI SaaS Dashboard", "End-to-End Analytics Platform", "Final Capstone Project"] },
      ] },
      { title: "MLOps & Data Pipelines", description: "Keeping models and pipelines running reliably over time.", topics: [
        { subject: "MLOps", items: ["MLflow", "DVC", "Airflow", "Kubeflow", "Docker", "Kubernetes", "CI/CD", "Model Monitoring", "Data Pipelines", "Drift Detection", "Retraining", "Experiment Tracking", "Feature Store", "Logging", "Automation", "Scaling", "Security", "Deployment", "Optimization", "Best Practices"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Python Questions", "SQL Questions", "Statistics Questions", "Probability Questions", "Machine Learning", "Data Analysis", "Tableau Questions", "Power BI Questions", "Business Case Studies", "Coding Questions", "HR Questions", "Behavioral Questions", "Resume Review", "Live Coding", "Analytics Questions", "ML Questions", "Salary Negotiation", "Mock Interviews", "Final Checklist", "FAANG Preparation"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub Portfolio", "Kaggle Profile", "Tableau Public", "Power BI Portfolio", "Open Source", "Certifications", "Networking", "Conferences", "Personal Branding", "Freelancing", "Remote Jobs", "Consulting", "Mentorship", "Productivity", "Time Management", "Career Planning", "Continuous Learning", "Best Practices"] },
      ] },
      { title: "AI Tools for Data Scientists", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "Gemini", "GitHub Copilot", "Cursor AI", "NotebookLM", "Perplexity", "Kaggle", "Jupyter Notebook", "Google Colab", "MLflow", "TensorBoard", "Power BI Copilot", "Tableau AI", "Prompt Engineering", "AI Data Analysis", "AI Visualization", "AI Report Generation", "AI Automation", "Best Practices"] },
      ] },
      { title: "Data Ethics & Governance", description: "Handling data and models responsibly.", topics: [
        { subject: "Responsible Data", items: ["Data Privacy", "GDPR Basics", "Data Governance", "Data Quality", "Bias Detection", "Fairness", "Responsible AI", "Explainable AI", "Security", "Compliance", "Copyright", "Data Ownership", "Encryption", "Risk Assessment", "Ethical Analytics", "AI Governance", "Data Auditing", "Secure Pipelines", "Case Studies", "Best Practices"] },
      ] },
      { title: "Becoming a Data Scientist at Top Companies", description: "The final layer — system design, communication, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["Data Science Portfolio", "Kaggle Competitions", "GitHub Projects", "Tableau Portfolio", "Power BI Portfolio", "SQL Mastery", "Business Case Studies", "AI Resume", "Technical Interviews", "Communication Skills", "Problem Solving", "Storytelling with Data", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Personal Branding", "Networking", "30-60-90 Day Learning Plan", "Final Career Checklist"] },
      ] },
    ],
  },
  devops: {
    title: "DevOps Engineer",
    tagline: "A complete, in-depth path from Linux fundamentals to a DevOps engineer at top companies.",
    steps: [
      { title: "Computer Science & Linux Fundamentals", description: "The OS and shell almost everything you'll run sits on top of.", topics: [
        { subject: "CS & Linux", items: ["Computer Fundamentals", "Operating Systems", "Linux Installation", "Linux File System", "Terminal Commands", "File Permissions", "Process Management", "Users & Groups", "Shell Scripting", "Networking Basics", "SSH", "Cron Jobs", "Package Managers", "System Monitoring", "Logs", "Environment Variables", "Bash Scripting", "Debugging", "Security Basics", "Best Practices"] },
      ] },
      { title: "Programming & Scripting", description: "Automating the repetitive parts of the job.", topics: [
        { subject: "Programming", items: ["Python Basics", "Bash Scripting", "PowerShell", "Variables", "Functions", "Loops", "File Handling", "APIs", "JSON", "YAML", "Error Handling", "Automation Scripts", "Logging", "Modules", "Regular Expressions", "CLI Tools", "Git Integration", "Testing Scripts", "Code Standards", "Best Practices"] },
      ] },
      { title: "Version Control", description: "The shared source of truth every pipeline builds on top of.", topics: [
        { subject: "Git", items: ["Git Basics", "GitHub", "GitLab", "Clone", "Commit", "Push", "Pull", "Branching", "Merging", "Rebase", "Pull Requests", "Tags", "Releases", "Git Ignore", "Cherry Pick", "Conflict Resolution", "GitHub Actions", "Collaboration", "CI Basics", "Best Practices"] },
      ] },
      { title: "Networking Fundamentals", description: "How traffic actually gets from a user to your server.", topics: [
        { subject: "Networking", items: ["OSI Model", "TCP/IP", "DNS", "HTTP", "HTTPS", "FTP", "SSH", "VPN", "Firewalls", "Load Balancer", "Reverse Proxy", "IP Addressing", "Subnetting", "Ports", "SSL/TLS", "CDN", "API Networking", "Monitoring", "Troubleshooting", "Best Practices"] },
      ] },
      { title: "Cloud Computing", description: "Running infrastructure beyond your own machine.", topics: [
        { subject: "Cloud", items: ["AWS Fundamentals", "Azure Fundamentals", "Google Cloud", "EC2", "S3", "IAM", "VPC", "Load Balancer", "Auto Scaling", "Route53", "Lambda", "Cloud Storage", "Cloud Monitoring", "Security Groups", "Billing", "Networking", "Serverless", "Cloud Deployment", "Multi Cloud", "Best Practices"] },
      ] },
      { title: "Docker", description: "Packaging an app so it runs the same everywhere.", topics: [
        { subject: "Docker", items: ["Docker Installation", "Images", "Containers", "Dockerfile", "Docker Compose", "Volumes", "Networks", "Registry", "Docker Hub", "Environment Variables", "Multi-stage Build", "Logging", "Debugging", "Container Security", "Optimization", "Health Checks", "Build Cache", "Private Registry", "Deployment", "Best Practices"] },
      ] },
      { title: "Kubernetes", description: "Running and scaling containers reliably across a cluster.", topics: [
        { subject: "Kubernetes", items: ["Cluster", "Pods", "Nodes", "Services", "Deployments", "ReplicaSets", "StatefulSets", "DaemonSets", "ConfigMaps", "Secrets", "Ingress", "Volumes", "Autoscaling", "Namespaces", "Helm", "Monitoring", "Logging", "Security", "Troubleshooting", "Best Practices"] },
      ] },
      { title: "CI/CD", description: "Automating build, test, and release so shipping isn't a manual event.", topics: [
        { subject: "CI/CD", items: ["CI Concepts", "CD Concepts", "GitHub Actions", "Jenkins", "GitLab CI", "Azure DevOps", "CircleCI", "Bitbucket Pipelines", "Build Pipeline", "Test Automation", "Deployment Pipeline", "Rollback", "Approval Workflow", "Secrets", "Artifacts", "Notifications", "Monitoring", "Optimization", "Automation", "Best Practices"] },
      ] },
      { title: "Infrastructure as Code (IaC)", description: "Defining infrastructure in version-controlled code instead of clicking around a console.", topics: [
        { subject: "IaC", items: ["Terraform", "Ansible", "Pulumi", "CloudFormation", "ARM Templates", "Modules", "Variables", "State Management", "Providers", "Provisioning", "Configuration Management", "Automation", "Security", "Secrets", "Version Control", "Validation", "Deployment", "Scaling", "Reusability", "Best Practices"] },
      ] },
      { title: "Monitoring & Logging", description: "Knowing when something breaks before your users do.", topics: [
        { subject: "Monitoring", items: ["Prometheus", "Grafana", "ELK Stack", "Loki", "Fluentd", "Datadog", "New Relic", "CloudWatch", "Alerting", "Metrics", "Dashboards", "Logs", "Tracing", "Jaeger", "OpenTelemetry", "Health Checks", "Performance", "Troubleshooting", "Incident Response", "Best Practices"] },
      ] },
      { title: "Security (DevSecOps)", description: "Building security into the pipeline, not bolting it on after.", topics: [
        { subject: "Security", items: ["IAM", "Secrets Management", "Vault", "SSL/TLS", "Firewalls", "Vulnerability Scanning", "SAST", "DAST", "Container Security", "Kubernetes Security", "Network Policies", "Compliance", "OWASP Basics", "Security Monitoring", "Threat Detection", "Encryption", "Backup", "Disaster Recovery", "Incident Response", "Best Practices"] },
      ] },
      { title: "Web Servers & Reverse Proxy", description: "Serving traffic efficiently and securely.", topics: [
        { subject: "Servers", items: ["Nginx", "Apache", "Reverse Proxy", "Load Balancer", "SSL Setup", "Virtual Hosts", "Caching", "Compression", "URL Rewriting", "Proxy Pass", "Rate Limiting", "Security Headers", "Logging", "Performance", "Monitoring", "HTTP/2", "HTTP/3", "CDN Integration", "Troubleshooting", "Best Practices"] },
      ] },
      { title: "Databases for DevOps", description: "Keeping the data layer running, backed up, and fast.", topics: [
        { subject: "Database", items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Backup", "Replication", "Clustering", "Performance", "Optimization", "Monitoring", "Database Security", "Migrations", "Docker Databases", "Cloud Databases", "Scaling", "Connection Pooling", "Disaster Recovery", "Automation", "Maintenance", "Best Practices"] },
      ] },
      { title: "DevOps Projects", description: "Proof of skill — the pipelines and infrastructure that actually get you hired.", topics: [
        { subject: "Projects", items: ["CI/CD Pipeline", "Dockerized App", "Kubernetes Deployment", "AWS Infrastructure", "Terraform Project", "Monitoring Dashboard", "Auto Scaling", "Blue-Green Deployment", "Canary Deployment", "Logging Pipeline", "Infrastructure Automation", "Secure Deployment", "GitOps Project", "Multi Cloud Setup", "High Availability", "Backup System", "AI Deployment Pipeline", "SaaS Deployment", "Production Cluster", "Final Capstone"] },
      ] },
      { title: "MLOps & AI Infrastructure", description: "Running AI/ML workloads reliably in production.", topics: [
        { subject: "MLOps", items: ["MLflow", "Kubeflow", "Airflow", "Docker", "Kubernetes", "GPU Deployment", "Model Serving", "FastAPI", "Vector Database", "AI Deployment", "AI Monitoring", "Drift Detection", "Retraining", "AI Pipelines", "LLM Deployment", "Ollama", "LangChain Deployment", "Automation", "Scaling", "Best Practices"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Linux Questions", "Docker Questions", "Kubernetes Questions", "Terraform Questions", "AWS Questions", "Jenkins Questions", "Networking Questions", "CI/CD Questions", "Security Questions", "Scripting Questions", "System Design", "Troubleshooting", "HR Questions", "Live Scenarios", "Resume Review", "Mock Interviews", "Salary Negotiation", "Production Cases", "Final Checklist", "FAANG Preparation"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub", "DevOps Portfolio", "Open Source", "Certifications", "AWS Certification", "Azure Certification", "Kubernetes Certification", "Networking", "Personal Branding", "Freelancing", "Remote Jobs", "Consulting", "Mentorship", "Productivity", "Leadership", "Career Planning", "Continuous Learning", "Best Practices"] },
      ] },
      { title: "AI Tools for DevOps Engineers", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "GitHub Copilot", "Cursor AI", "Windsurf", "Gemini", "Perplexity", "OpenRouter", "Ollama", "Docker AI", "Kubernetes AI", "Terraform AI", "AI Monitoring", "AI Log Analysis", "AI Incident Detection", "AI Automation", "Prompt Engineering", "AI Agents", "MCP Servers", "Best Practices"] },
      ] },
      { title: "DevOps Best Practices", description: "The habits that separate a hobbyist setup from a production-grade one.", topics: [
        { subject: "Professional DevOps", items: ["GitOps", "Blue-Green Deployment", "Canary Deployment", "Infrastructure Automation", "Observability", "High Availability", "Disaster Recovery", "Cost Optimization", "Auto Scaling", "Zero Downtime Deployment", "Performance Tuning", "Capacity Planning", "Documentation", "Team Collaboration", "Agile DevOps", "SRE Basics", "Production Readiness", "Compliance", "Governance", "Best Practices"] },
      ] },
      { title: "Becoming a DevOps Engineer at Top Companies", description: "The final layer — system design, communication, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["DevOps Portfolio", "GitHub Projects", "Cloud Projects", "Docker Projects", "Kubernetes Projects", "Terraform Projects", "AWS Resume", "Technical Interviews", "System Design", "Production Case Studies", "Communication Skills", "Problem Solving", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Personal Branding", "Networking", "30-60-90 Day Learning Plan", "Final Career Checklist"] },
      ] },
    ],
  },
  cloud: {
    title: "Cloud Engineer",
    tagline: "A complete, in-depth path from Linux fundamentals to a cloud engineer at top companies.",
    steps: [
      { title: "Computer Science & Linux Fundamentals", description: "The OS and shell almost everything you'll run sits on top of.", topics: [
        { subject: "CS & Linux", items: ["Computer Fundamentals", "Operating Systems", "Linux Installation", "Linux Commands", "File System", "Process Management", "Users & Groups", "Permissions", "Shell Scripting", "Environment Variables", "SSH", "Networking Basics", "System Monitoring", "Logs", "Package Managers", "Bash Scripting", "Cron Jobs", "Debugging", "Security Basics", "Best Practices"] },
      ] },
      { title: "Networking Fundamentals", description: "How traffic actually gets from a user to your infrastructure.", topics: [
        { subject: "Networking", items: ["OSI Model", "TCP/IP", "DNS", "HTTP & HTTPS", "FTP", "SSH", "VPN", "Firewalls", "Load Balancer", "Reverse Proxy", "IP Addressing", "CIDR", "Subnetting", "Routing", "NAT", "SSL/TLS", "CDN", "API Networking", "Troubleshooting", "Best Practices"] },
      ] },
      { title: "Programming & Automation", description: "Scripting away the manual, repetitive parts of cloud work.", topics: [
        { subject: "Programming", items: ["Python", "Bash", "PowerShell", "Variables", "Functions", "Loops", "JSON", "YAML", "APIs", "Error Handling", "Logging", "Automation Scripts", "Modules", "CLI Tools", "Regular Expressions", "File Handling", "Git Integration", "Testing", "Best Practices", "Mini Projects"] },
      ] },
      { title: "Version Control", description: "The shared source of truth every deployment builds on top of.", topics: [
        { subject: "Git", items: ["Git Basics", "GitHub", "GitLab", "Clone", "Commit", "Push", "Pull", "Branches", "Merge", "Rebase", "Pull Requests", "Git Ignore", "Tags", "Releases", "GitHub Actions", "Collaboration", "Conflict Resolution", "Fork", "CI Basics", "Best Practices"] },
      ] },
      { title: "AWS Cloud", description: "The most widely used cloud platform, end to end.", topics: [
        { subject: "AWS", items: ["AWS Global Infrastructure", "IAM", "EC2", "S3", "EBS", "VPC", "Route53", "ELB", "Auto Scaling", "RDS", "DynamoDB", "Lambda", "CloudFront", "CloudWatch", "SNS", "SQS", "API Gateway", "Secrets Manager", "Cost Explorer", "Best Practices"] },
      ] },
      { title: "Microsoft Azure", description: "Enterprise cloud — Microsoft's platform, end to end.", topics: [
        { subject: "Azure", items: ["Azure Portal", "Virtual Machines", "Azure Storage", "Azure Networking", "Azure SQL", "Azure Functions", "Azure Active Directory", "Azure Monitor", "Load Balancer", "Azure DevOps", "App Services", "Key Vault", "Virtual Network", "AKS", "Azure Security", "Azure Backup", "Cost Management", "Logic Apps", "ARM Templates", "Best Practices"] },
      ] },
      { title: "Google Cloud Platform", description: "Google's cloud platform, end to end.", topics: [
        { subject: "Google Cloud", items: ["Compute Engine", "Cloud Storage", "Cloud Run", "Cloud SQL", "BigQuery", "Kubernetes Engine", "Cloud Functions", "VPC", "IAM", "Monitoring", "Logging", "Pub/Sub", "Load Balancing", "Cloud CDN", "Secret Manager", "Vertex AI", "Billing", "Security", "Deployment", "Best Practices"] },
      ] },
      { title: "Infrastructure as Code", description: "Reproducible, reviewable infrastructure instead of manual console clicks.", topics: [
        { subject: "IaC", items: ["Terraform", "CloudFormation", "Pulumi", "ARM Templates", "Modules", "Variables", "State Management", "Providers", "Provisioning", "Validation", "Secrets", "Automation", "Version Control", "Reusability", "Security", "Scaling", "Deployment", "Optimization", "Testing", "Best Practices"] },
      ] },
      { title: "Containers & Kubernetes", description: "Packaging and orchestrating workloads across any cloud.", topics: [
        { subject: "Containers", items: ["Docker", "Docker Compose", "Images", "Containers", "Dockerfile", "Kubernetes", "Pods", "Deployments", "Services", "ConfigMaps", "Secrets", "Ingress", "Volumes", "Helm", "Autoscaling", "Monitoring", "Logging", "Security", "Deployment", "Best Practices"] },
      ] },
      { title: "Cloud Security", description: "Keeping infrastructure locked down by default, not as an afterthought.", topics: [
        { subject: "Security", items: ["IAM", "MFA", "Encryption", "SSL/TLS", "Secrets Management", "Key Management", "Security Groups", "Firewalls", "Network Security", "Compliance", "Cloud Security Best Practices", "Identity Federation", "Zero Trust", "Vulnerability Scanning", "Monitoring", "Incident Response", "Backup", "Disaster Recovery", "Risk Assessment", "Governance"] },
      ] },
      { title: "Storage & Databases", description: "Storing and serving data reliably at cloud scale.", topics: [
        { subject: "Storage", items: ["Object Storage", "Block Storage", "File Storage", "RDS", "PostgreSQL", "MySQL", "DynamoDB", "MongoDB Atlas", "Cloud SQL", "Backup", "Replication", "Indexing", "Scaling", "Performance", "Security", "Disaster Recovery", "Monitoring", "Optimization", "Migration", "Best Practices"] },
      ] },
      { title: "CI/CD & Cloud Automation", description: "Automating build, test, and release across cloud infrastructure.", topics: [
        { subject: "CI/CD", items: ["GitHub Actions", "Jenkins", "GitLab CI", "Azure DevOps", "Build Pipelines", "Deployment Pipelines", "Rollback", "Secrets", "Automation", "Testing", "Monitoring", "Notifications", "Infrastructure Deployment", "Cloud Deployment", "Docker Pipeline", "Kubernetes Pipeline", "Optimization", "Security", "Scaling", "Best Practices"] },
      ] },
      { title: "Monitoring & Logging", description: "Knowing when something breaks before your users do.", topics: [
        { subject: "Monitoring", items: ["CloudWatch", "Azure Monitor", "Google Monitoring", "Grafana", "Prometheus", "ELK Stack", "Loki", "Alerting", "Dashboards", "Metrics", "Logs", "Tracing", "OpenTelemetry", "Performance", "Health Checks", "Troubleshooting", "Incident Management", "Reporting", "Automation", "Best Practices"] },
      ] },
      { title: "Serverless Computing", description: "Running code without managing servers at all.", topics: [
        { subject: "Serverless", items: ["AWS Lambda", "Azure Functions", "Google Cloud Functions", "EventBridge", "API Gateway", "Step Functions", "Serverless Framework", "Event-Driven Architecture", "Scaling", "Monitoring", "Logging", "Security", "Performance", "Cost Optimization", "Automation", "Deployment", "Versioning", "Testing", "CI/CD", "Best Practices"] },
      ] },
      { title: "Cloud Projects", description: "Proof of skill — the infrastructure that actually gets you hired.", topics: [
        { subject: "Projects", items: ["Static Website Hosting", "Cloud Portfolio", "Multi-Tier Web App", "Serverless API", "File Storage System", "Auto Scaling Infrastructure", "Kubernetes Deployment", "CI/CD Pipeline", "Cloud Monitoring Dashboard", "Disaster Recovery Setup", "Terraform Infrastructure", "AI Deployment", "SaaS Deployment", "Hybrid Cloud Project", "Multi Cloud Deployment", "Secure Cloud Architecture", "Cloud Migration", "High Availability System", "Cost Optimization Project", "Final Capstone"] },
      ] },
      { title: "Cloud Certifications", description: "Validating and structuring your learning with recognized certs.", topics: [
        { subject: "Certifications", items: ["AWS Cloud Practitioner", "AWS Solutions Architect", "AWS Developer", "AWS SysOps", "Azure Fundamentals", "Azure Administrator", "Azure Architect", "Google Cloud Associate", "Google Professional Cloud Architect", "Terraform Associate", "Kubernetes CKA", "CKAD", "Linux Foundation", "CompTIA Cloud+", "Security Certifications", "DevOps Certifications", "AI Cloud Certifications", "Exam Strategy", "Practice Tests", "Certification Roadmap"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["AWS Questions", "Azure Questions", "GCP Questions", "Linux Questions", "Networking Questions", "Docker Questions", "Kubernetes Questions", "Terraform Questions", "Cloud Security Questions", "System Design", "Troubleshooting", "HR Questions", "Resume Review", "Live Scenarios", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Architecture Questions", "Cloud Case Studies", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub", "Cloud Portfolio", "Certifications", "Open Source", "Personal Branding", "Networking", "Freelancing", "Remote Jobs", "Consulting", "Conferences", "Mentorship", "Productivity", "Leadership", "Career Planning", "Continuous Learning", "Salary Negotiation", "Startup vs MNC", "Best Practices"] },
      ] },
      { title: "AI Tools for Cloud Engineers", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "GitHub Copilot", "Cursor AI", "Gemini", "Perplexity", "AWS Q Developer", "Azure AI Assistant", "Google Gemini Code Assist", "Terraform AI", "Kubernetes AI", "Docker AI", "AI Log Analysis", "AI Monitoring", "AI Incident Detection", "Prompt Engineering", "MCP Servers", "AI Automation", "AI Infrastructure", "Best Practices"] },
      ] },
      { title: "Becoming a Cloud Engineer at Top Companies", description: "The final layer — system design, communication, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["Cloud Portfolio", "AWS Projects", "Azure Projects", "GCP Projects", "Kubernetes Projects", "Terraform Projects", "Architecture Design", "Technical Interviews", "System Design", "Communication Skills", "Problem Solving", "Cloud Case Studies", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Networking", "Personal Branding", "30-60-90 Day Learning Plan", "Final Career Checklist"] },
      ] },
    ],
  },
  "ui-ux": {
    title: "UI/UX Designer",
    tagline: "A complete, in-depth path from design fundamentals to a UI/UX designer at top companies.",
    steps: [
      { title: "Design Fundamentals", description: "The visual and conceptual basics every design decision builds on.", topics: [
        { subject: "Design Basics", items: ["What is UI Design?", "What is UX Design?", "Design Principles", "Color Theory", "Typography", "Layout & Composition", "Visual Hierarchy", "White Space", "Alignment", "Contrast", "Balance", "Proximity", "Gestalt Principles", "Branding Basics", "Accessibility", "Responsive Design", "Design Psychology", "Design Thinking", "Problem Solving", "Best Practices"] },
      ] },
      { title: "User Experience (UX)", description: "Understanding what people actually need before you design anything.", topics: [
        { subject: "UX Design", items: ["User Research", "User Personas", "User Journey Maps", "Empathy Maps", "User Flows", "Information Architecture", "Card Sorting", "User Interviews", "Surveys", "Pain Points", "UX Strategy", "Task Analysis", "Heuristic Evaluation", "Competitive Analysis", "Design Thinking", "UX Writing", "Accessibility", "UX Metrics", "Case Studies", "Best Practices"] },
      ] },
      { title: "User Interface (UI)", description: "Turning a UX flow into a real, usable interface.", topics: [
        { subject: "UI Design", items: ["Layout Design", "Grid Systems", "Spacing", "Buttons", "Forms", "Navigation", "Icons", "Cards", "Modals", "Tables", "Dashboards", "Mobile UI", "Web UI", "Responsive UI", "Visual Consistency", "Design Patterns", "Components", "Design Tokens", "Micro Interactions", "Best Practices"] },
      ] },
      { title: "Figma", description: "The industry-standard tool for UI design and collaboration.", topics: [
        { subject: "Figma", items: ["Interface", "Frames", "Auto Layout", "Components", "Variants", "Variables", "Constraints", "Prototyping", "Design Systems", "Libraries", "Plugins", "Team Collaboration", "Dev Mode", "Comments", "Exports", "Responsive Design", "Interactive Components", "Design Handoff", "File Organization", "Best Practices"] },
      ] },
      { title: "Wireframing", description: "Sketching ideas fast, before investing in visuals.", topics: [
        { subject: "Wireframes", items: ["Low Fidelity", "Mid Fidelity", "High Fidelity", "Sketching", "User Flows", "Mobile Wireframes", "Web Wireframes", "Dashboard Wireframes", "Landing Pages", "SaaS Wireframes", "E-commerce", "Forms", "Navigation", "Content Structure", "Iteration", "Validation", "Feedback", "Best Practices", "Portfolio Examples", "Mini Projects"] },
      ] },
      { title: "Prototyping", description: "Making your designs clickable before a single line of code is written.", topics: [
        { subject: "Prototype", items: ["Interactive Prototype", "Clickable Prototype", "Animations", "Smart Animate", "Transitions", "Overlay", "Scrolling", "Gestures", "Micro Interactions", "User Testing", "Mobile Prototype", "Web Prototype", "Presentation", "Feedback", "Iteration", "Validation", "Handoff", "Prototype Sharing", "Testing", "Best Practices"] },
      ] },
      { title: "Design Systems", description: "Reusable components and consistent patterns across a whole product.", topics: [
        { subject: "Design System", items: ["Components", "Variants", "Design Tokens", "Color System", "Typography System", "Icons", "Buttons", "Forms", "Inputs", "Cards", "Navigation", "Modals", "Tables", "Documentation", "Naming Convention", "Libraries", "Reusability", "Consistency", "Collaboration", "Best Practices"] },
      ] },
      { title: "UX Research", description: "Getting real evidence instead of guessing what users want.", topics: [
        { subject: "Research", items: ["User Interviews", "Surveys", "Questionnaires", "Usability Testing", "Heatmaps", "Session Recording", "A/B Testing", "Analytics", "Personas", "Journey Maps", "Card Sorting", "Tree Testing", "Affinity Mapping", "Competitor Research", "Stakeholder Interviews", "Focus Groups", "Feedback Analysis", "Data Collection", "Reporting", "Best Practices"] },
      ] },
      { title: "Accessibility (A11Y)", description: "Designing for every user, including screen readers and low-vision users.", topics: [
        { subject: "Accessibility", items: ["WCAG", "Color Contrast", "Keyboard Navigation", "Screen Readers", "Alt Text", "Focus States", "Typography", "ARIA Basics", "Inclusive Design", "Forms", "Error Messages", "Navigation", "Mobile Accessibility", "Accessibility Testing", "Compliance", "Accessibility Audit", "UX Accessibility", "Best Practices", "Tools", "Case Studies"] },
      ] },
      { title: "Design Tools", description: "The broader toolkit around Figma every team actually uses.", topics: [
        { subject: "Tools", items: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "Miro", "FigJam", "Maze", "Zeplin", "InVision", "Notion", "Jira", "Trello", "Slack", "Loom", "Framer", "ProtoPie", "Principle", "Canva", "Best Practices"] },
      ] },
      { title: "Responsive & Mobile Design", description: "Making one design work everywhere, from phone to desktop.", topics: [
        { subject: "Responsive Design", items: ["Mobile First", "Tablet Design", "Desktop Design", "Breakpoints", "Grid Systems", "Auto Layout", "Adaptive Design", "Responsive Components", "Design Tokens", "Accessibility", "Mobile Navigation", "Gestures", "Responsive Images", "Responsive Typography", "Testing", "Device Preview", "Best Practices", "Case Studies", "Portfolio Projects", "Optimization"] },
      ] },
      { title: "UX Writing", description: "The words in the interface, designed with as much care as the pixels.", topics: [
        { subject: "Content Design", items: ["Microcopy", "Button Labels", "Error Messages", "Empty States", "Success Messages", "Onboarding", "Tooltips", "Placeholder Text", "Tone of Voice", "Brand Voice", "Accessibility Writing", "Confirmation Messages", "Navigation Labels", "Forms", "Content Strategy", "Localization", "AI Content", "Best Practices", "Examples", "Case Studies"] },
      ] },
      { title: "Collaboration with Developers", description: "Handing off a design that actually gets built the way you intended.", topics: [
        { subject: "Developer Handoff", items: ["Dev Mode", "Design Specs", "CSS Basics", "HTML Basics", "Responsive Design", "Assets Export", "Tokens", "Documentation", "Jira Workflow", "Git Basics", "Agile", "Sprint Planning", "Design Review", "QA Review", "Feedback", "Bug Reports", "Collaboration Tools", "Communication", "Handoff Checklist", "Best Practices"] },
      ] },
      { title: "UI/UX Projects", description: "Proof of skill — the projects that actually get you hired.", topics: [
        { subject: "Projects", items: ["Portfolio Website", "Mobile Banking App", "Food Delivery App", "Fitness App", "Healthcare Dashboard", "CRM Dashboard", "SaaS Platform", "Job Portal", "E-commerce Website", "Travel Booking App", "Learning Platform", "AI Chatbot UI", "Finance Dashboard", "Social Media App", "Smart Home App", "OTT Platform", "Admin Dashboard", "AI SaaS Dashboard", "Case Study Project", "Final Portfolio Project"] },
      ] },
      { title: "Portfolio Building", description: "Presenting case studies that show your thinking, not just your screens.", topics: [
        { subject: "Portfolio", items: ["Behance", "Dribbble", "Personal Website", "Case Studies", "Problem Statement", "Design Process", "Research", "Wireframes", "UI Screens", "Prototype", "User Testing", "Results", "GitHub (Optional)", "Resume", "LinkedIn", "Branding", "Testimonials", "Storytelling", "Presentation", "Best Practices"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["UX Questions", "UI Questions", "Figma Questions", "Design System Questions", "Portfolio Review", "Whiteboard Challenge", "Design Challenge", "Case Study Presentation", "UX Research Questions", "Accessibility Questions", "Product Thinking", "HR Questions", "Behavioral Questions", "Communication Skills", "Mock Interviews", "Resume Review", "Salary Negotiation", "MNC Preparation", "Final Checklist", "Live Design Exercise"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "Behance Profile", "Dribbble Profile", "Personal Branding", "Networking", "Open Source Design", "Freelancing", "Remote Jobs", "Consulting", "Certifications", "Conferences", "Mentorship", "Productivity", "Leadership", "Time Management", "Career Planning", "Continuous Learning", "Startup vs MNC", "Best Practices"] },
      ] },
      { title: "AI Tools for UI/UX Designers", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "Gemini", "Figma AI", "Adobe Firefly", "Midjourney", "DALL·E", "Canva AI", "Uizard", "Galileo AI", "Framer AI", "Relume AI", "v0 by Vercel", "Lovable", "Bolt.new", "Cursor AI", "Prompt Engineering", "AI UX Research", "AI Design Systems", "Best Practices"] },
      ] },
      { title: "UI/UX Best Practices", description: "The habits that separate professional design work from a nice-looking mockup.", topics: [
        { subject: "Professional Design", items: ["Design Thinking", "Human-Centered Design", "Accessibility", "Usability", "Consistency", "Visual Hierarchy", "Minimalism", "Mobile First", "User Feedback", "A/B Testing", "Design QA", "Product Thinking", "Business Goals", "KPIs", "Documentation", "Collaboration", "Ethics", "Trends", "Innovation", "Best Practices"] },
      ] },
      { title: "Becoming a UI/UX Designer at Top Companies", description: "The final layer — portfolio, product thinking, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["Strong Portfolio", "Case Studies", "Design Challenges", "Figma Mastery", "UX Research Portfolio", "Design Systems", "Product Thinking", "Communication Skills", "Mock Interviews", "Resume Optimization", "LinkedIn Branding", "Behance Optimization", "Dribbble Presence", "Networking", "FAANG Preparation", "Startup vs MNC", "Salary Negotiation", "30-60-90 Day Learning Plan", "Career Roadmap", "Final Checklist"] },
      ] },
    ],
  },
  qa: {
    title: "QA Engineer",
    tagline: "A complete, in-depth path from testing fundamentals to a QA engineer at top companies.",
    steps: [
      { title: "Software Testing Fundamentals", description: "Where bugs actually come from, and how testing catches them.", topics: [
        { subject: "Testing Basics", items: ["What is Software Testing?", "SDLC", "STLC", "Testing Life Cycle", "Bug Life Cycle", "Testing Levels", "Testing Types", "Verification", "Validation", "Test Strategy", "Test Plan", "Test Cases", "Test Scenarios", "Defect Reporting", "Root Cause Analysis", "Quality Assurance", "Quality Control", "Risk Analysis", "Documentation", "Best Practices"] },
      ] },
      { title: "Manual Testing", description: "The full range of testing done by hand, before you automate anything.", topics: [
        { subject: "Manual Testing", items: ["Smoke Testing", "Sanity Testing", "Functional Testing", "Regression Testing", "Retesting", "Integration Testing", "System Testing", "Acceptance Testing", "Exploratory Testing", "Ad-hoc Testing", "GUI Testing", "Compatibility Testing", "Localization Testing", "Usability Testing", "Cross Browser Testing", "Mobile Testing", "Defect Tracking", "Test Reports", "Test Metrics", "Best Practices"] },
      ] },
      { title: "Bug Tracking Tools", description: "Recording and communicating defects clearly to the whole team.", topics: [
        { subject: "Bug Management", items: ["Jira", "Azure DevOps", "Bugzilla", "Trello", "ClickUp", "Linear", "Issue Tracking", "Sprint Boards", "Bug Reports", "Severity", "Priority", "Workflow", "Epics", "Stories", "Test Evidence", "Screenshots", "Logs", "Attachments", "Reporting", "Best Practices"] },
      ] },
      { title: "SQL for QA", description: "Verifying data directly at the database layer, not just through the UI.", topics: [
        { subject: "SQL", items: ["Database Basics", "SQL Queries", "SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "GROUP BY", "ORDER BY", "JOINS", "Aggregations", "Indexes", "Views", "Stored Procedures", "Transactions", "Database Testing", "Data Validation", "Optimization", "Reporting", "Best Practices"] },
      ] },
      { title: "API Testing", description: "Testing beyond the UI, at the layer most bugs actually hide in.", topics: [
        { subject: "API Testing", items: ["REST API", "SOAP", "GraphQL", "HTTP Methods", "Status Codes", "JSON", "XML", "Postman", "Swagger", "Authentication", "JWT", "OAuth", "Headers", "Query Parameters", "API Validation", "API Automation", "Error Handling", "Mock APIs", "Performance", "Best Practices"] },
      ] },
      { title: "Automation Testing", description: "Scripting the repetitive checks so you can focus on the interesting bugs.", topics: [
        { subject: "Automation", items: ["Selenium", "Playwright", "Cypress", "WebDriver", "TestNG", "JUnit", "Pytest", "Java", "JavaScript", "Python", "Automation Framework", "Page Object Model", "Data Driven Testing", "Keyword Driven Testing", "BDD", "Cucumber", "Assertions", "Reports", "Debugging", "Best Practices"] },
      ] },
      { title: "Programming for QA", description: "The coding skills every automation engineer eventually needs.", topics: [
        { subject: "Programming", items: ["Java", "JavaScript", "Python", "Variables", "Functions", "Loops", "OOP", "Exception Handling", "Collections", "Arrays", "Strings", "File Handling", "APIs", "JSON", "XML", "Logging", "Testing", "Git", "Debugging", "Best Practices"] },
      ] },
      { title: "Mobile Testing", description: "Testing across the fragmentation of real Android and iOS devices.", topics: [
        { subject: "Mobile QA", items: ["Android Testing", "iOS Testing", "Responsive Testing", "Device Testing", "Emulator", "Real Devices", "Appium", "BrowserStack", "Firebase Test Lab", "APK Testing", "Mobile Automation", "Accessibility", "Performance", "Network Testing", "Notifications", "Offline Testing", "Permissions", "Crash Logs", "Reporting", "Best Practices"] },
      ] },
      { title: "Performance Testing", description: "Knowing how a system behaves under real load, before users find out.", topics: [
        { subject: "Performance", items: ["JMeter", "LoadRunner", "K6", "Stress Testing", "Load Testing", "Spike Testing", "Endurance Testing", "Volume Testing", "Throughput", "Response Time", "Bottleneck Analysis", "Monitoring", "Server Metrics", "CPU", "Memory", "Network", "Reports", "Optimization", "Analysis", "Best Practices"] },
      ] },
      { title: "Security Testing", description: "Testing for the vulnerabilities attackers actually look for.", topics: [
        { subject: "Security", items: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF", "Authentication Testing", "Authorization", "Session Management", "Security Headers", "SSL/TLS", "API Security", "JWT Testing", "OAuth Testing", "Vulnerability Scanning", "Penetration Basics", "Burp Suite", "ZAP", "Compliance", "Reporting", "Risk Analysis", "Best Practices"] },
      ] },
      { title: "CI/CD for QA", description: "Running your test suite automatically on every code change.", topics: [
        { subject: "CI/CD", items: ["GitHub Actions", "Jenkins", "GitLab CI", "Azure DevOps", "Build Pipeline", "Test Automation", "Deployment", "Rollback", "Notifications", "Docker Basics", "Kubernetes Basics", "Parallel Testing", "Reports", "Artifacts", "Secrets", "Monitoring", "Scheduling", "Automation", "Integration", "Best Practices"] },
      ] },
      { title: "Version Control", description: "The shared workflow every real test codebase runs on.", topics: [
        { subject: "Git", items: ["Git Basics", "GitHub", "Clone", "Commit", "Push", "Pull", "Branch", "Merge", "Rebase", "Pull Requests", "Tags", "Releases", "Git Ignore", "Conflict Resolution", "GitHub Actions", "Collaboration", "Workflow", "Code Review", "CI Integration", "Best Practices"] },
      ] },
      { title: "Test Management", description: "Organizing test coverage and execution across a whole team.", topics: [
        { subject: "Management", items: ["TestRail", "Zephyr", "Xray", "Test Planning", "Test Execution", "Test Suites", "Test Reports", "Coverage", "Metrics", "Traceability", "Risk Assessment", "Documentation", "Team Collaboration", "Sprint Planning", "Agile Testing", "Scrum", "Release Testing", "Regression Planning", "Reporting", "Best Practices"] },
      ] },
      { title: "QA Projects", description: "Proof of skill — the test suites that actually get you hired.", topics: [
        { subject: "Projects", items: ["E-commerce Testing", "Banking App Testing", "Healthcare App Testing", "CRM Testing", "ERP Testing", "Job Portal Testing", "Food Delivery Testing", "OTT Platform Testing", "Mobile App Testing", "API Testing Project", "Automation Framework", "Selenium Project", "Cypress Project", "Playwright Project", "Performance Testing", "Security Testing", "AI Testing Project", "SaaS Testing", "Dashboard Testing", "Final Capstone"] },
      ] },
      { title: "AI Testing & Modern QA", description: "Testing the new class of applications — chatbots, LLMs, and AI agents.", topics: [
        { subject: "AI QA", items: ["AI Application Testing", "Chatbot Testing", "LLM Testing", "Prompt Testing", "AI Output Validation", "AI Hallucination Testing", "Model Evaluation", "AI Safety", "RAG Testing", "Bias Testing", "AI Regression Testing", "AI Performance", "AI Security", "AI APIs", "AI Automation", "AI Test Cases", "Synthetic Data", "AI Monitoring", "AI Reporting", "Best Practices"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Manual Testing Questions", "Selenium Questions", "API Testing Questions", "SQL Questions", "Playwright Questions", "Cypress Questions", "Performance Testing", "Security Testing", "Agile Questions", "Jira Questions", "Coding Basics", "HR Questions", "Resume Review", "Mock Interviews", "Live Scenarios", "Bug Analysis", "Salary Negotiation", "MNC Preparation", "Final Checklist", "FAANG Preparation"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub", "Automation Portfolio", "Certifications", "Personal Branding", "Networking", "Freelancing", "Remote Jobs", "Open Source", "Mentorship", "Productivity", "Leadership", "Career Planning", "Continuous Learning", "Startup vs MNC", "Communication Skills", "Salary Growth", "Certifications Roadmap", "Best Practices"] },
      ] },
      { title: "AI Tools for QA Engineers", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "GitHub Copilot", "Cursor AI", "Gemini", "Perplexity", "Testim", "Mabl", "Applitools", "BrowserStack AI", "LambdaTest AI", "AI Test Case Generator", "AI Bug Detection", "AI Automation", "Prompt Engineering", "AI Documentation", "MCP Servers", "AI Reporting", "AI Debugging", "Best Practices"] },
      ] },
      { title: "QA Best Practices", description: "The habits that separate professional QA from ad-hoc clicking around.", topics: [
        { subject: "Professional QA", items: ["Shift Left Testing", "Shift Right Testing", "Test Pyramid", "Automation Strategy", "Risk-Based Testing", "Continuous Testing", "Documentation", "Collaboration", "Agile QA", "DevOps Integration", "Test Coverage", "Quality Metrics", "Monitoring", "Reporting", "Defect Prevention", "RCA", "Code Reviews", "Test Reviews", "Compliance", "Best Practices"] },
      ] },
      { title: "Becoming a QA Engineer at Top Companies", description: "The final layer — portfolio, automation depth, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["QA Portfolio", "Automation Projects", "Selenium Projects", "Playwright Projects", "API Testing Projects", "Performance Projects", "Resume Optimization", "LinkedIn Branding", "Technical Interviews", "Communication Skills", "Mock Interviews", "Problem Solving", "Bug Analysis", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Networking", "30-60-90 Day Learning Plan", "Career Roadmap", "Final Checklist"] },
      ] },
    ],
  },
  "cyber-security": {
    title: "Cyber Security Engineer",
    tagline: "A complete, in-depth path from networking fundamentals to a cybersecurity engineer at top companies.",
    steps: [
      { title: "Computer Science & Networking Fundamentals", description: "You can't secure what you don't understand.", topics: [
        { subject: "CS & Networking", items: ["Computer Fundamentals", "Operating Systems", "Linux Basics", "Windows Basics", "Networking Basics", "OSI Model", "TCP/IP", "DNS", "HTTP & HTTPS", "IP Addressing", "Subnetting", "Routing", "Switching", "VPN", "Firewalls", "SSH", "Command Line", "Virtualization", "Cloud Basics", "Best Practices"] },
      ] },
      { title: "Linux for Security", description: "Command-line fluency and hardening the OS attackers target most.", topics: [
        { subject: "Linux Security", items: ["Linux Installation", "Terminal Commands", "File System", "File Permissions", "Users & Groups", "Processes", "Bash Scripting", "Cron Jobs", "Package Management", "Logs", "SSH", "Services", "Networking Commands", "Firewall", "System Monitoring", "Security Hardening", "File Integrity", "Auditing", "Troubleshooting", "Best Practices"] },
      ] },
      { title: "Programming for Cybersecurity", description: "Scripting the automation and analysis tools security work depends on.", topics: [
        { subject: "Programming", items: ["Python", "Bash", "PowerShell", "Variables", "Functions", "Loops", "File Handling", "Networking Scripts", "APIs", "JSON", "Error Handling", "Automation", "Regex", "Logging", "Socket Programming", "Cryptography Basics", "Git", "Testing", "Mini Projects", "Best Practices"] },
      ] },
      { title: "Networking Security", description: "Protecting the traffic flowing across your network.", topics: [
        { subject: "Network Security", items: ["Firewalls", "IDS", "IPS", "VPN", "Proxy", "NAT", "VLAN", "Network Segmentation", "Wireshark", "Packet Analysis", "DNS Security", "Email Security", "Secure Protocols", "Port Scanning", "Network Monitoring", "DDoS Protection", "Load Balancers", "Zero Trust", "Secure Architecture", "Best Practices"] },
      ] },
      { title: "Web Security", description: "The OWASP Top 10 and the vulnerabilities that matter most.", topics: [
        { subject: "Web Security", items: ["HTTP Methods", "Cookies", "Sessions", "Authentication", "Authorization", "JWT", "OAuth", "CORS", "CSRF", "XSS", "SQL Injection", "Command Injection", "SSRF", "XXE", "File Upload Security", "Secure APIs", "OWASP Top 10", "Security Headers", "HTTPS", "Best Practices"] },
      ] },
      { title: "Operating System Security", description: "Hardening the systems attackers try to gain a foothold on.", topics: [
        { subject: "OS Security", items: ["Windows Security", "Linux Security", "User Management", "Group Policies", "Active Directory Basics", "Endpoint Security", "Disk Encryption", "Antivirus", "EDR", "Patch Management", "Secure Boot", "Logging", "Monitoring", "Process Security", "Registry Security", "System Hardening", "Access Control", "Backup", "Recovery", "Best Practices"] },
      ] },
      { title: "Ethical Hacking", description: "Thinking through an attacker's playbook, legally.", topics: [
        { subject: "Ethical Hacking", items: ["Penetration Testing", "Reconnaissance", "Footprinting", "Scanning", "Enumeration", "Vulnerability Assessment", "Exploitation Basics", "Privilege Escalation", "Password Attacks", "Wireless Security", "Social Engineering", "Web Hacking", "Mobile Security", "Reporting", "Exploit Frameworks", "Red Team Basics", "Lab Setup", "Capture the Flag", "Legal Considerations", "Best Practices"] },
      ] },
      { title: "Vulnerability Assessment", description: "Finding weaknesses before an attacker does.", topics: [
        { subject: "VA/PT", items: ["Nessus", "OpenVAS", "Nmap", "Nikto", "Burp Suite", "OWASP ZAP", "CVEs", "CVSS", "Risk Assessment", "Reporting", "Patch Validation", "Scanning", "Threat Analysis", "False Positives", "Prioritization", "Remediation", "Verification", "Compliance", "Documentation", "Best Practices"] },
      ] },
      { title: "Security Tools", description: "The toolkit every practicing security engineer relies on.", topics: [
        { subject: "Security Tools", items: ["Nmap", "Wireshark", "Burp Suite", "Metasploit", "Hydra", "John the Ripper", "Hashcat", "Aircrack-ng", "Kali Linux", "OWASP ZAP", "Snort", "Suricata", "Nessus", "OpenVAS", "Splunk", "ELK Stack", "YARA", "Sysmon", "CrowdStrike Basics", "Best Practices"] },
      ] },
      { title: "Identity & Access Management (IAM)", description: "Controlling who can access what, and proving it.", topics: [
        { subject: "IAM", items: ["Authentication", "Authorization", "RBAC", "ABAC", "Active Directory", "LDAP", "SSO", "MFA", "Password Policies", "Privileged Access", "Azure AD", "AWS IAM", "Google IAM", "Identity Federation", "Access Reviews", "Lifecycle Management", "Secrets Management", "PAM", "Zero Trust", "Best Practices"] },
      ] },
      { title: "Cloud Security", description: "Securing infrastructure that isn't sitting in your own building.", topics: [
        { subject: "Cloud Security", items: ["AWS Security", "Azure Security", "GCP Security", "IAM", "Security Groups", "VPC Security", "Encryption", "Key Management", "CloudTrail", "GuardDuty", "Defender for Cloud", "Security Center", "Secrets Manager", "Compliance", "Cloud Monitoring", "Container Security", "Kubernetes Security", "Serverless Security", "Incident Response", "Best Practices"] },
      ] },
      { title: "Security Operations (SOC)", description: "Detecting and triaging threats as they actually happen.", topics: [
        { subject: "SOC", items: ["SIEM", "SOC Workflow", "Log Analysis", "Incident Detection", "Threat Hunting", "Splunk", "ELK Stack", "Microsoft Sentinel", "QRadar", "Alerts", "Correlation Rules", "MITRE ATT&CK", "IOC Analysis", "Malware Analysis Basics", "Reporting", "Automation", "Escalation", "Documentation", "Case Management", "Best Practices"] },
      ] },
      { title: "Incident Response & Digital Forensics", description: "Responding to and investigating a breach after it happens.", topics: [
        { subject: "Incident Response", items: ["Incident Lifecycle", "Evidence Collection", "Disk Forensics", "Memory Forensics", "Log Analysis", "Malware Investigation", "Chain of Custody", "Threat Containment", "Recovery", "Root Cause Analysis", "Reporting", "Communication", "Timeline Analysis", "Forensic Tools", "DFIR", "Threat Intelligence", "Backup Recovery", "Crisis Management", "Documentation", "Best Practices"] },
      ] },
      { title: "DevSecOps", description: "Building security into the pipeline instead of bolting it on after.", topics: [
        { subject: "DevSecOps", items: ["Secure SDLC", "SAST", "DAST", "Dependency Scanning", "Container Security", "IaC Security", "Secrets Scanning", "GitHub Security", "CI/CD Security", "Docker Security", "Kubernetes Security", "Cloud Security", "API Security", "Code Review", "Compliance", "Automation", "Monitoring", "Vulnerability Management", "Policy as Code", "Best Practices"] },
      ] },
      { title: "Cybersecurity Projects", description: "Proof of skill — the labs and builds that actually get you hired.", topics: [
        { subject: "Projects", items: ["Home SOC Lab", "Network Scanner", "Password Manager", "Secure Login System", "Vulnerability Scanner", "Web Security Audit", "SIEM Dashboard", "Malware Analysis Lab", "Threat Detection", "Log Monitoring", "Secure API", "Firewall Configuration", "Cloud Security Audit", "DevSecOps Pipeline", "IAM Implementation", "Phishing Detection", "AI Security Project", "CTF Challenges", "Security Automation", "Final Capstone"] },
      ] },
      { title: "Certifications", description: "Validating and structuring your learning with recognized certs.", topics: [
        { subject: "Certifications", items: ["CompTIA Security+", "CEH", "eJPT", "PNPT", "CISSP", "OSCP", "AWS Security", "Azure Security", "Google Cloud Security", "Cisco CCNA", "CySA+", "GSEC", "GIAC", "Microsoft SC-900", "ISO 27001", "CISM", "CISA", "Certification Roadmap", "Practice Labs", "Exam Strategy"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Networking Questions", "Linux Questions", "Security Questions", "OWASP Questions", "IAM Questions", "Cloud Security", "SOC Questions", "Incident Response", "Pen Testing", "SIEM Questions", "Python Questions", "HR Questions", "Resume Review", "Mock Interviews", "Live Scenarios", "Security Case Studies", "Salary Negotiation", "FAANG Preparation", "Security Labs", "Final Checklist"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub", "Security Portfolio", "TryHackMe", "Hack The Box", "Open Source", "Networking", "Freelancing", "Remote Jobs", "Consulting", "Conferences", "Bug Bounty", "Personal Branding", "Mentorship", "Productivity", "Leadership", "Career Planning", "Continuous Learning", "Best Practices"] },
      ] },
      { title: "AI Tools for Cybersecurity", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "Gemini", "GitHub Copilot", "Cursor AI", "Perplexity", "Microsoft Security Copilot", "Google Threat Intelligence", "AI Log Analysis", "AI Threat Detection", "AI Malware Analysis", "AI SOC Assistant", "Prompt Engineering", "AI Security Automation", "AI Incident Response", "AI Vulnerability Analysis", "MCP Servers", "AI Agents", "AI Governance", "Best Practices"] },
      ] },
      { title: "Becoming a Cybersecurity Engineer at Top Companies", description: "The final layer — labs, certifications, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["Security Portfolio", "CTF Competitions", "TryHackMe Labs", "Hack The Box Labs", "Bug Bounty Experience", "Certifications", "GitHub Projects", "Technical Interviews", "Security Case Studies", "Threat Modeling", "Communication Skills", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Personal Branding", "Networking", "30-60-90 Day Learning Plan", "Career Roadmap", "Final Checklist"] },
      ] },
    ],
  },
  "mobile-development": {
    title: "Mobile Developer",
    tagline: "A complete, in-depth path from programming fundamentals to a mobile developer at top companies.",
    steps: [
      { title: "Programming Fundamentals", description: "The logic and problem-solving skills every mobile stack builds on.", topics: [
        { subject: "Programming Basics", items: ["Computer Fundamentals", "Problem Solving", "Variables", "Data Types", "Operators", "Control Flow", "Functions", "Arrays", "Objects", "OOP", "Error Handling", "Data Structures", "Algorithms Basics", "File Handling", "Debugging", "IDE Setup", "Command Line", "Git Basics", "Coding Standards", "Best Practices"] },
      ] },
      { title: "Mobile Development Fundamentals", description: "How mobile apps actually differ from web apps.", topics: [
        { subject: "Mobile Basics", items: ["Android vs iOS", "Native vs Cross Platform", "Mobile Architecture", "Mobile UI Guidelines", "Mobile App Lifecycle", "App Store Ecosystem", "Device Types", "Screen Sizes", "Responsive Layouts", "Mobile UX", "Mobile Performance", "Mobile Security", "Mobile Storage", "Offline Support", "Sensors", "Notifications", "Deep Linking", "App Permissions", "App Publishing", "Best Practices"] },
      ] },
      { title: "Programming Languages", description: "The languages behind every major mobile stack.", topics: [
        { subject: "Languages", items: ["Dart", "Kotlin", "Swift", "Java", "JavaScript", "TypeScript", "OOP", "Async Programming", "Error Handling", "Collections", "Generics", "Lambdas", "Extensions", "Packages", "Modules", "Debugging", "Performance", "Code Style", "Testing", "Best Practices"] },
      ] },
      { title: "Version Control", description: "The shared workflow every real codebase runs on.", topics: [
        { subject: "Git", items: ["Git Basics", "GitHub", "Clone", "Commit", "Push", "Pull", "Branches", "Merge", "Rebase", "Pull Requests", "Git Ignore", "Tags", "Releases", "GitHub Actions", "Collaboration", "Conflict Resolution", "Code Reviews", "CI Basics", "Workflow", "Best Practices"] },
      ] },
      { title: "Flutter Development", description: "Google's cross-platform toolkit — one codebase, both platforms.", topics: [
        { subject: "Flutter", items: ["Dart Basics", "Widgets", "Layouts", "Navigation", "State Management", "Forms", "API Integration", "Local Storage", "Firebase", "Animations", "Responsive UI", "Theme", "Packages", "Performance", "Testing", "Deployment", "Platform Channels", "Architecture", "Clean Code", "Best Practices"] },
      ] },
      { title: "React Native", description: "Cross-platform mobile development for JavaScript developers.", topics: [
        { subject: "React Native", items: ["Components", "JSX", "Navigation", "Hooks", "State Management", "API Integration", "Redux", "Async Storage", "Firebase", "Push Notifications", "Native Modules", "Performance", "Styling", "Animations", "Testing", "Deployment", "Expo", "CLI", "Architecture", "Best Practices"] },
      ] },
      { title: "Android Development", description: "Native Android, the way most jobs actually build it.", topics: [
        { subject: "Android", items: ["Android Studio", "Kotlin", "Activities", "Fragments", "Jetpack Compose", "XML Layout", "Navigation", "Room Database", "ViewModel", "LiveData", "Coroutines", "WorkManager", "Firebase", "Notifications", "Permissions", "Performance", "Testing", "Deployment", "Play Store", "Best Practices"] },
      ] },
      { title: "iOS Development", description: "Native iOS, the way most jobs actually build it.", topics: [
        { subject: "iOS", items: ["Xcode", "Swift", "SwiftUI", "UIKit", "Navigation", "Core Data", "MVVM", "Combine", "API Integration", "Notifications", "Permissions", "Animations", "Local Storage", "Firebase", "Performance", "Testing", "App Store", "Deployment", "Architecture", "Best Practices"] },
      ] },
      { title: "Mobile UI/UX", description: "Designing interfaces that feel native to each platform.", topics: [
        { subject: "UI/UX", items: ["Material Design", "Apple HIG", "Responsive Design", "Auto Layout", "Typography", "Color Theory", "Accessibility", "Animations", "Gestures", "Navigation", "Components", "Design Systems", "Dark Mode", "Icons", "Forms", "Dashboards", "User Flows", "Wireframes", "Figma", "Best Practices"] },
      ] },
      { title: "APIs & Backend Integration", description: "Connecting your app to real data and services.", topics: [
        { subject: "Backend", items: ["REST APIs", "GraphQL", "JSON", "Authentication", "JWT", "OAuth", "CRUD Operations", "File Upload", "Pagination", "Error Handling", "WebSockets", "Push Notifications", "Firebase APIs", "Payments", "Maps", "Third-party APIs", "Security", "Performance", "Offline Sync", "Best Practices"] },
      ] },
      { title: "Databases & Local Storage", description: "Keeping data available even when the network isn't.", topics: [
        { subject: "Storage", items: ["SQLite", "Hive", "Room", "Core Data", "Shared Preferences", "Secure Storage", "Firebase Firestore", "Firebase Realtime Database", "Realm", "Drift", "Local Cache", "Offline Data", "Synchronization", "Backup", "Encryption", "Queries", "Relationships", "Performance", "Migration", "Best Practices"] },
      ] },
      { title: "Firebase & Cloud Services", description: "The backend most mobile apps reach for first.", topics: [
        { subject: "Firebase", items: ["Authentication", "Firestore", "Realtime Database", "Storage", "Crashlytics", "Analytics", "Cloud Messaging", "Cloud Functions", "Hosting", "Remote Config", "Performance Monitoring", "App Distribution", "Dynamic Links", "Security Rules", "A/B Testing", "Machine Learning Kit", "AI APIs", "Integration", "Deployment", "Best Practices"] },
      ] },
      { title: "Testing & Debugging", description: "Confidence that your app actually works across real devices.", topics: [
        { subject: "Testing", items: ["Unit Testing", "Widget Testing", "UI Testing", "Integration Testing", "Mocking", "Assertions", "Performance Testing", "Device Testing", "Emulator", "Crash Analysis", "Debugging", "Profiling", "Memory Leak Detection", "Network Debugging", "Firebase Crashlytics", "Automation", "Reports", "CI Testing", "Quality Assurance", "Best Practices"] },
      ] },
      { title: "Performance Optimization", description: "Keeping the app smooth on lower-end devices, not just the latest flagship.", topics: [
        { subject: "Optimization", items: ["App Size", "Lazy Loading", "Image Optimization", "Memory Management", "Battery Optimization", "Network Optimization", "Caching", "Rendering", "Animations", "Background Tasks", "Startup Time", "Performance Profiling", "CPU Usage", "GPU Rendering", "Offline Support", "Security", "Monitoring", "Optimization Tools", "Scalability", "Best Practices"] },
      ] },
      { title: "Mobile App Projects", description: "Proof of skill — the apps that actually get you hired.", topics: [
        { subject: "Projects", items: ["To-Do App", "Weather App", "Notes App", "Expense Tracker", "Chat App", "Food Delivery App", "Banking App", "Fitness App", "E-commerce App", "OTT App", "Learning App", "Ride Booking App", "AI Chatbot App", "Hospital App", "CRM App", "Job Portal App", "Social Media App", "Finance Dashboard", "SaaS Mobile App", "Final Capstone"] },
      ] },
      { title: "App Deployment", description: "Getting a real app live on the Play Store and App Store.", topics: [
        { subject: "Deployment", items: ["Google Play Console", "App Store Connect", "App Signing", "Certificates", "Provisioning Profiles", "Build Variants", "APK", "AAB", "TestFlight", "Beta Testing", "Release Notes", "App Review", "Store Optimization", "Versioning", "Rollback", "Monitoring", "Analytics", "Crash Reports", "CI/CD", "Best Practices"] },
      ] },
      { title: "Interview Preparation", description: "Everything between applying and getting the offer.", topics: [
        { subject: "Interview", items: ["Flutter Questions", "React Native Questions", "Android Questions", "iOS Questions", "Dart Questions", "Kotlin Questions", "Swift Questions", "API Questions", "Firebase Questions", "Mobile Architecture", "Coding Round", "HR Questions", "Resume Review", "Live Coding", "Debugging", "Mock Interviews", "Salary Negotiation", "MNC Preparation", "Final Checklist", "FAANG Preparation"] },
      ] },
      { title: "Career Growth", description: "Building a career, not just landing one job.", topics: [
        { subject: "Career", items: ["ATS Resume", "LinkedIn Profile", "GitHub", "Portfolio", "Play Store Portfolio", "App Store Portfolio", "Freelancing", "Remote Jobs", "Open Source", "Networking", "Personal Branding", "Certifications", "Conferences", "Mentorship", "Productivity", "Leadership", "Startup vs MNC", "Salary Growth", "Career Planning", "Best Practices"] },
      ] },
      { title: "AI Tools for Mobile Developers", description: "Working faster by working alongside AI itself.", topics: [
        { subject: "AI Tools", items: ["ChatGPT", "Claude", "GitHub Copilot", "Cursor AI", "Gemini", "Flutter AI", "Android Studio AI", "Xcode AI", "Firebase AI", "Supabase AI", "v0", "Bolt.new", "Lovable", "Prompt Engineering", "AI UI Generation", "AI Code Review", "AI Debugging", "MCP Servers", "AI Testing", "Best Practices"] },
      ] },
      { title: "Becoming a Mobile Developer at Top Companies", description: "The final layer — published apps, architecture depth, and interview readiness for top companies.", topics: [
        { subject: "MNC Preparation", items: ["Mobile Portfolio", "Play Store Apps", "App Store Apps", "GitHub Projects", "Flutter Projects", "React Native Projects", "Android Projects", "iOS Projects", "System Design", "Mobile Architecture", "Communication Skills", "Problem Solving", "Technical Interviews", "Mock Interviews", "Salary Negotiation", "FAANG Preparation", "Startup vs MNC", "Networking", "30-60-90 Day Learning Plan", "Final Career Checklist"] },
      ] },
    ],
  },
};

export const HIRING_COMPANIES = [
  "Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro", "Accenture",
  "IBM", "Cognizant", "Capgemini", "Deloitte", "HCLTech", "Tech Mahindra",
  "Oracle", "SAP", "Adobe", "Flipkart", "Meta", "Salesforce", "JPMorgan Chase",
];
