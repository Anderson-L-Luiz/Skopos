export interface MockJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  description: string;
  skills: string[];
  source: string;
  sourceUrl: string;
  trustScore: number;
  postedAt: Date;
}

const companies = [
  "Google", "Microsoft", "Stripe", "Airbnb", "Netflix", "Meta", "Amazon",
  "Apple", "Shopify", "Figma", "Notion", "Vercel", "Linear", "Supabase",
  "GitHub", "Atlassian", "Salesforce", "Databricks", "Snowflake", "Palantir",
  "SpaceX", "Uber", "Lyft", "DoorDash", "Robinhood", "Plaid", "Brex",
  "OpenAI", "Anthropic", "Cohere", "Scale AI", "Weights & Biases",
];

const locations = [
  "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
  "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Denver, CO",
  "Atlanta, GA", "Remote", "London, UK", "Berlin, Germany",
];

const sources = ["indeed", "linkedin", "glassdoor"];
const sourceTrustScores: Record<string, number> = {
  indeed: 0.85,
  linkedin: 0.9,
  glassdoor: 0.8,
};

const jobTemplates = [
  {
    title: "Senior Software Engineer",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker"],
    salaryMin: 150000,
    salaryMax: 220000,
    description: `We're looking for a Senior Software Engineer to join our growing engineering team. You'll work on challenging problems at scale, mentor junior engineers, and help shape our technical direction.

Key Responsibilities:
- Design and implement scalable backend services and APIs
- Collaborate with product and design teams to deliver new features
- Lead code reviews and set coding standards
- Participate in on-call rotation and incident response
- Mentor junior engineers and conduct technical interviews

Requirements:
- 5+ years of professional software engineering experience
- Strong proficiency in TypeScript/JavaScript and React
- Experience with cloud platforms (AWS, GCP, or Azure)
- Solid understanding of distributed systems and databases
- Experience with containerization (Docker, Kubernetes)`,
  },
  {
    title: "Full Stack Engineer",
    skills: ["React", "Next.js", "Python", "Django", "PostgreSQL", "Redis"],
    salaryMin: 120000,
    salaryMax: 180000,
    description: `Join our product team as a Full Stack Engineer and help build the features our users love. You'll work across the entire stack from database design to pixel-perfect UI.

Key Responsibilities:
- Build and maintain full-stack web applications
- Optimize application performance and scalability
- Work closely with designers to implement UI/UX designs
- Write tests and maintain high code coverage
- Contribute to architectural decisions

Requirements:
- 3+ years of full stack development experience
- Proficiency with React, Next.js or similar frameworks
- Experience with Python/Django or Node.js backend
- Strong understanding of SQL databases
- Knowledge of caching strategies and Redis`,
  },
  {
    title: "Machine Learning Engineer",
    skills: ["Python", "TensorFlow", "PyTorch", "Spark", "SQL", "Kubernetes"],
    salaryMin: 160000,
    salaryMax: 250000,
    description: `We're building the next generation of AI-powered products and need a talented Machine Learning Engineer to join our team. You'll work on everything from data pipelines to model deployment.

Key Responsibilities:
- Design and train machine learning models
- Build and maintain ML pipelines and infrastructure
- Collaborate with data scientists on model development
- Deploy and monitor ML models in production
- Optimize model performance and resource usage

Requirements:
- Strong background in machine learning and deep learning
- Proficiency in Python and ML frameworks (TensorFlow/PyTorch)
- Experience with distributed computing (Spark, Dask)
- Knowledge of MLOps practices and tools
- MS/PhD in CS, Statistics, or related field preferred`,
  },
  {
    title: "Data Engineer",
    skills: ["Python", "Spark", "Kafka", "dbt", "Snowflake", "Airflow"],
    salaryMin: 130000,
    salaryMax: 190000,
    description: `Looking for a Data Engineer to help us build robust data infrastructure that powers our analytics and ML initiatives.

Key Responsibilities:
- Design and maintain data pipelines and ETL processes
- Build and optimize data warehouse schemas
- Work with analytics and ML teams to understand data needs
- Ensure data quality and reliability
- Monitor and troubleshoot data issues

Requirements:
- 3+ years of data engineering experience
- Experience with distributed data processing (Spark, Flink)
- Proficiency with data warehouses (Snowflake, BigQuery, Redshift)
- Knowledge of orchestration tools (Airflow, Prefect)
- Strong SQL skills`,
  },
  {
    title: "DevOps Engineer",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Python", "Go"],
    salaryMin: 130000,
    salaryMax: 200000,
    description: `Join our Platform team as a DevOps Engineer and help us build reliable, scalable infrastructure that enables our engineering teams to move fast.

Key Responsibilities:
- Design and maintain CI/CD pipelines
- Manage Kubernetes clusters and infrastructure
- Implement infrastructure as code using Terraform
- Monitor system health and respond to incidents
- Improve developer productivity and tooling

Requirements:
- 4+ years of DevOps/SRE experience
- Strong knowledge of Kubernetes and container orchestration
- Experience with infrastructure as code (Terraform, Pulumi)
- Proficiency with AWS, GCP, or Azure
- Experience with monitoring and observability tools`,
  },
  {
    title: "Product Manager",
    skills: ["Product Strategy", "Data Analysis", "SQL", "Figma", "Roadmapping", "A/B Testing"],
    salaryMin: 140000,
    salaryMax: 200000,
    description: `We're seeking a Product Manager to own and drive our core product experience. You'll work cross-functionally to define product strategy and execute on the roadmap.

Key Responsibilities:
- Define product vision and roadmap
- Work with engineering and design to ship features
- Conduct user research and analyze product metrics
- Run A/B tests and iterate based on results
- Communicate product decisions to stakeholders

Requirements:
- 4+ years of product management experience
- Strong analytical skills and comfort with data
- Experience with product analytics tools
- Excellent communication and leadership skills
- Technical background preferred`,
  },
  {
    title: "Frontend Engineer",
    skills: ["React", "TypeScript", "CSS", "GraphQL", "Webpack", "Testing"],
    salaryMin: 120000,
    salaryMax: 180000,
    description: `Looking for a Frontend Engineer passionate about building beautiful, performant user interfaces that delight our customers.

Key Responsibilities:
- Build and maintain React applications
- Implement responsive, accessible UI components
- Optimize frontend performance
- Write comprehensive tests
- Collaborate with designers on UI/UX

Requirements:
- 3+ years of frontend development experience
- Expert knowledge of React and TypeScript
- Strong CSS and responsive design skills
- Experience with modern build tools
- Understanding of web performance optimization`,
  },
  {
    title: "Backend Engineer",
    skills: ["Go", "PostgreSQL", "gRPC", "Docker", "Kubernetes", "Redis"],
    salaryMin: 140000,
    salaryMax: 200000,
    description: `Join our infrastructure team to build high-performance backend services that power our products at scale.

Key Responsibilities:
- Design and build scalable microservices
- Optimize database queries and data models
- Build and maintain APIs for internal and external use
- Contribute to system architecture decisions
- Participate in code reviews and technical discussions

Requirements:
- 4+ years of backend engineering experience
- Proficiency in Go, Rust, or Java
- Experience with microservices and distributed systems
- Strong knowledge of databases (PostgreSQL, MySQL)
- Experience with message queues and streaming`,
  },
  {
    title: "Site Reliability Engineer",
    skills: ["Kubernetes", "Prometheus", "Go", "Python", "AWS", "Terraform"],
    salaryMin: 150000,
    salaryMax: 220000,
    description: `We need an SRE to ensure our systems are reliable, scalable, and efficient. You'll work closely with development teams to improve system reliability.

Key Responsibilities:
- Define and track SLOs and error budgets
- Build and improve monitoring and alerting
- Respond to and resolve production incidents
- Drive reliability improvements in the development lifecycle
- Automate operational tasks

Requirements:
- 4+ years of SRE/DevOps experience
- Strong programming skills (Go or Python)
- Deep knowledge of distributed systems
- Experience with observability tools (Prometheus, Grafana, Jaeger)
- Excellent problem-solving skills under pressure`,
  },
  {
    title: "iOS Engineer",
    skills: ["Swift", "SwiftUI", "Objective-C", "CoreData", "XCode", "REST APIs"],
    salaryMin: 130000,
    salaryMax: 190000,
    description: `Join our mobile team to build and enhance our iOS application used by millions of users worldwide.

Key Responsibilities:
- Design and implement iOS application features
- Ensure performance and quality of the application
- Identify and fix bugs and performance bottlenecks
- Collaborate with cross-functional teams
- Keep up with latest iOS development practices

Requirements:
- 3+ years of iOS development experience
- Proficiency in Swift and SwiftUI
- Experience with Core Data and local storage
- Knowledge of iOS security and best practices
- Published apps on the App Store preferred`,
  },
  {
    title: "Android Engineer",
    skills: ["Kotlin", "Android SDK", "Jetpack Compose", "Room", "Coroutines", "REST APIs"],
    salaryMin: 130000,
    salaryMax: 190000,
    description: `Build exceptional Android experiences for our millions of users. You'll work on our flagship Android application, implementing new features and improving performance.

Key Responsibilities:
- Develop and maintain Android applications
- Implement clean architecture patterns
- Write unit and integration tests
- Optimize app performance and battery usage
- Review code and mentor junior developers

Requirements:
- 3+ years of Android development experience
- Strong Kotlin skills and knowledge of Jetpack libraries
- Experience with Jetpack Compose
- Understanding of Android lifecycle and memory management
- Published apps on Google Play preferred`,
  },
  {
    title: "Security Engineer",
    skills: ["Penetration Testing", "AWS Security", "Python", "Kubernetes", "SIEM", "Threat Modeling"],
    salaryMin: 150000,
    salaryMax: 220000,
    description: `Help us protect our systems and customer data. As a Security Engineer, you'll design security controls and respond to threats.

Key Responsibilities:
- Conduct security assessments and penetration tests
- Design and implement security controls
- Respond to security incidents
- Review code for security vulnerabilities
- Maintain security tooling and infrastructure

Requirements:
- 4+ years of security engineering experience
- Knowledge of common vulnerabilities and attack vectors
- Experience with cloud security (AWS/GCP/Azure)
- Security certifications (CISSP, CEH, OSCP) preferred
- Scripting skills (Python, Bash)`,
  },
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export function generateMockJobs(): MockJob[] {
  const jobs: MockJob[] = [];
  let jobIndex = 0;

  for (const template of jobTemplates) {
    for (let i = 0; i < 4; i++) {
      const company = companies[jobIndex % companies.length];
      const source = sources[jobIndex % sources.length];
      const loc = locations[jobIndex % locations.length];
      const isRemote = loc === "Remote" || Math.random() > 0.6;

      jobs.push({
        externalId: `${source}-${jobIndex + 1000}`,
        title: template.title,
        company,
        location: isRemote ? "Remote" : loc,
        remote: isRemote,
        salaryMin: template.salaryMin + Math.floor(Math.random() * 20000),
        salaryMax: template.salaryMax + Math.floor(Math.random() * 30000),
        description: template.description,
        skills: template.skills,
        source,
        sourceUrl: `https://${source}.com/jobs/${jobIndex + 1000}`,
        trustScore: sourceTrustScores[source],
        postedAt: daysAgo(Math.floor(Math.random() * 30)),
      });

      jobIndex++;
    }
  }

  // Add more varied jobs to reach 50+
  const extraTitles = [
    { title: "Staff Engineer", skills: ["System Design", "TypeScript", "Go", "PostgreSQL", "Kubernetes"] },
    { title: "Engineering Manager", skills: ["Leadership", "TypeScript", "Agile", "System Design", "Hiring"] },
    { title: "Principal Engineer", skills: ["Architecture", "Python", "Distributed Systems", "Technical Strategy"] },
    { title: "Data Scientist", skills: ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow"] },
    { title: "Solutions Architect", skills: ["AWS", "System Design", "Kubernetes", "Terraform", "Communication"] },
    { title: "Technical Lead", skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Leadership"] },
  ];

  for (const extra of extraTitles) {
    for (let i = 0; i < 2; i++) {
      const company = randomElement(companies);
      const source = randomElement(sources);
      const loc = randomElement(locations);
      const isRemote = loc === "Remote" || Math.random() > 0.5;

      jobs.push({
        externalId: `${source}-${jobIndex + 1000}`,
        title: extra.title,
        company,
        location: isRemote ? "Remote" : loc,
        remote: isRemote,
        salaryMin: 130000 + Math.floor(Math.random() * 50000),
        salaryMax: 200000 + Math.floor(Math.random() * 80000),
        description: `${company} is looking for a talented ${extra.title} to join their team. This is an exciting opportunity to work on cutting-edge technology and make a real impact.\n\nYou will be working with a talented team of engineers to build scalable systems and deliver high-quality software. Strong communication skills and a passion for engineering excellence are essential.\n\nBenefits include competitive salary, equity, health insurance, 401k, flexible PTO, and remote work options.`,
        skills: extra.skills,
        source,
        sourceUrl: `https://${source}.com/jobs/${jobIndex + 1000}`,
        trustScore: sourceTrustScores[source],
        postedAt: daysAgo(Math.floor(Math.random() * 20)),
      });

      jobIndex++;
    }
  }

  return jobs;
}
