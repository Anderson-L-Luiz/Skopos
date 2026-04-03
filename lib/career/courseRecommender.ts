export interface CourseRecommendation {
  skillName: string;
  courses: Course[];
}

export interface Course {
  title: string;
  platform: string;
  url: string;
  type: "free" | "paid";
  estimatedHours: number;
}

const courseDatabase: Record<string, Course[]> = {
  react: [
    {
      title: "React - The Complete Guide 2024",
      platform: "Udemy",
      url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
      type: "paid",
      estimatedHours: 40,
    },
    {
      title: "React Documentation",
      platform: "Official Docs",
      url: "https://react.dev",
      type: "free",
      estimatedHours: 20,
    },
    {
      title: "React Fundamentals",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=9U3-M47ItkM",
      type: "free",
      estimatedHours: 8,
    },
  ],
  typescript: [
    {
      title: "TypeScript Course for Beginners",
      platform: "Udemy",
      url: "https://www.udemy.com/course/typescript-the-complete-developers-guide/",
      type: "paid",
      estimatedHours: 20,
    },
    {
      title: "TypeScript Handbook",
      platform: "Official Docs",
      url: "https://www.typescriptlang.org/docs/",
      type: "free",
      estimatedHours: 15,
    },
    {
      title: "TypeScript Tutorial",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=gieEQFIfgYc",
      type: "free",
      estimatedHours: 6,
    },
  ],
  python: [
    {
      title: "Complete Python Bootcamp",
      platform: "Udemy",
      url: "https://www.udemy.com/course/complete-python-bootcamp/",
      type: "paid",
      estimatedHours: 22,
    },
    {
      title: "Python for Everybody",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=8DvO9XSnhtE",
      type: "free",
      estimatedHours: 14,
    },
    {
      title: "Python Official Tutorial",
      platform: "Official Docs",
      url: "https://docs.python.org/3/tutorial/",
      type: "free",
      estimatedHours: 10,
    },
  ],
  nodejs: [
    {
      title: "The Complete Node.js Developer Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/nodejs-the-complete-guide/",
      type: "paid",
      estimatedHours: 36,
    },
    {
      title: "Node.js Documentation",
      platform: "Official Docs",
      url: "https://nodejs.org/en/docs/",
      type: "free",
      estimatedHours: 15,
    },
    {
      title: "Node.js Tutorial",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=ENrzD9HAZJQ",
      type: "free",
      estimatedHours: 4,
    },
  ],
  "next.js": [
    {
      title: "Next.js 14 & React Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/next-js-react-the-complete-guide/",
      type: "paid",
      estimatedHours: 25,
    },
    {
      title: "Next.js Learn Course",
      platform: "Official Docs",
      url: "https://nextjs.org/learn",
      type: "free",
      estimatedHours: 12,
    },
  ],
  aws: [
    {
      title: "AWS Certified Cloud Practitioner",
      platform: "Udemy",
      url: "https://www.udemy.com/course/aws-certified-cloud-practitioner/",
      type: "paid",
      estimatedHours: 20,
    },
    {
      title: "AWS Skill Builder",
      platform: "AWS Official",
      url: "https://skillbuilder.aws.com/",
      type: "free",
      estimatedHours: 30,
    },
    {
      title: "AWS Fundamentals",
      platform: "Coursera",
      url: "https://www.coursera.org/learn/aws-fundamentals",
      type: "free",
      estimatedHours: 10,
    },
  ],
  docker: [
    {
      title: "Docker & Kubernetes: The Complete Guide",
      platform: "Udemy",
      url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
      type: "paid",
      estimatedHours: 22,
    },
    {
      title: "Docker Documentation",
      platform: "Official Docs",
      url: "https://docs.docker.com/",
      type: "free",
      estimatedHours: 10,
    },
    {
      title: "Docker Tutorial",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      type: "free",
      estimatedHours: 4,
    },
  ],
  kubernetes: [
    {
      title: "Kubernetes for Developers",
      platform: "Udemy",
      url: "https://www.udemy.com/course/kubernetes-for-developers/",
      type: "paid",
      estimatedHours: 24,
    },
    {
      title: "Kubernetes Documentation",
      platform: "Official Docs",
      url: "https://kubernetes.io/docs/",
      type: "free",
      estimatedHours: 20,
    },
    {
      title: "Kubernetes in 100 Seconds",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=PziYflu8cB8",
      type: "free",
      estimatedHours: 0.1,
    },
  ],
  sql: [
    {
      title: "The Complete SQL Bootcamp",
      platform: "Udemy",
      url: "https://www.udemy.com/course/the-complete-sql-bootcamp/",
      type: "paid",
      estimatedHours: 16,
    },
    {
      title: "SQL Tutorial",
      platform: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Learn/SQL",
      type: "free",
      estimatedHours: 12,
    },
    {
      title: "SQL in 100 Seconds",
      platform: "YouTube",
      url: "https://www.youtube.com/watch?v=zsjvFFKOm3c",
      type: "free",
      estimatedHours: 0.1,
    },
  ],
  mongodb: [
    {
      title: "The Complete Developers Guide to MongoDB",
      platform: "Udemy",
      url: "https://www.udemy.com/course/the-complete-developers-guide-to-mongodb/",
      type: "paid",
      estimatedHours: 12,
    },
    {
      title: "MongoDB Documentation",
      platform: "Official Docs",
      url: "https://docs.mongodb.com/",
      type: "free",
      estimatedHours: 15,
    },
  ],
  postgresql: [
    {
      title: "SQL and PostgreSQL",
      platform: "Udemy",
      url: "https://www.udemy.com/course/sql-and-postgresql/",
      type: "paid",
      estimatedHours: 18,
    },
    {
      title: "PostgreSQL Documentation",
      platform: "Official Docs",
      url: "https://www.postgresql.org/docs/",
      type: "free",
      estimatedHours: 20,
    },
  ],
  graphql: [
    {
      title: "GraphQL by Example",
      platform: "Udemy",
      url: "https://www.udemy.com/course/graphql-by-example/",
      type: "paid",
      estimatedHours: 12,
    },
    {
      title: "GraphQL Official Docs",
      platform: "Official Docs",
      url: "https://graphql.org/learn/",
      type: "free",
      estimatedHours: 10,
    },
  ],
  rest: [
    {
      title: "REST APIs Course",
      platform: "Coursera",
      url: "https://www.coursera.org/learn/api",
      type: "free",
      estimatedHours: 10,
    },
    {
      title: "RESTful Web Services",
      platform: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
      type: "free",
      estimatedHours: 5,
    },
  ],
  git: [
    {
      title: "Git Complete: The definitive, step-by-step guide to Git",
      platform: "Udemy",
      url: "https://www.udemy.com/course/git-complete/",
      type: "paid",
      estimatedHours: 10,
    },
    {
      title: "Git Documentation",
      platform: "Official Docs",
      url: "https://git-scm.com/doc",
      type: "free",
      estimatedHours: 8,
    },
    {
      title: "Git Tutorial",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      type: "free",
      estimatedHours: 2,
    },
  ],
  "machine learning": [
    {
      title: "Machine Learning A-Z",
      platform: "Udemy",
      url: "https://www.udemy.com/course/machinelearning/",
      type: "paid",
      estimatedHours: 44,
    },
    {
      title: "Machine Learning Course",
      platform: "Coursera",
      url: "https://www.coursera.org/learn/machine-learning",
      type: "free",
      estimatedHours: 60,
    },
    {
      title: "Fast.ai Deep Learning",
      platform: "Fast.ai",
      url: "https://www.fast.ai/",
      type: "free",
      estimatedHours: 50,
    },
  ],
  "deep learning": [
    {
      title: "Deep Learning Specialization",
      platform: "Coursera",
      url: "https://www.coursera.org/specializations/deep-learning",
      type: "free",
      estimatedHours: 80,
    },
    {
      title: "PyTorch Deep Learning",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=Z_ikDlimN_M",
      type: "free",
      estimatedHours: 25,
    },
  ],
  tensorflow: [
    {
      title: "TensorFlow 2.0 Complete Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/tensorflow-2-0-complete-course/",
      type: "paid",
      estimatedHours: 20,
    },
    {
      title: "TensorFlow Official Tutorials",
      platform: "Official Docs",
      url: "https://www.tensorflow.org/tutorials",
      type: "free",
      estimatedHours: 30,
    },
  ],
  pytorch: [
    {
      title: "PyTorch for Deep Learning",
      platform: "Udemy",
      url: "https://www.udemy.com/course/pytorch-for-deep-learning-and-computer-vision/",
      type: "paid",
      estimatedHours: 30,
    },
    {
      title: "PyTorch Official Tutorials",
      platform: "Official Docs",
      url: "https://pytorch.org/tutorials/",
      type: "free",
      estimatedHours: 25,
    },
  ],
  "system design": [
    {
      title: "System Design Interview Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/system-design-interview/",
      type: "paid",
      estimatedHours: 16,
    },
    {
      title: "System Design Primer",
      platform: "GitHub",
      url: "https://github.com/donnemartin/system-design-primer",
      type: "free",
      estimatedHours: 40,
    },
  ],
  testing: [
    {
      title: "Testing JavaScript",
      platform: "Kent C Dodds",
      url: "https://testingjavascript.com/",
      type: "paid",
      estimatedHours: 20,
    },
    {
      title: "Jest Testing Framework",
      platform: "Official Docs",
      url: "https://jestjs.io/docs/getting-started",
      type: "free",
      estimatedHours: 8,
    },
  ],
  microservices: [
    {
      title: "Microservices Architecture",
      platform: "Udemy",
      url: "https://www.udemy.com/course/microservices-architecture/",
      type: "paid",
      estimatedHours: 24,
    },
    {
      title: "Microservices Learning Path",
      platform: "Linux Academy",
      url: "https://linuxacademy.com/learning/",
      type: "paid",
      estimatedHours: 40,
    },
  ],
  cicd: [
    {
      title: "GitLab CI/CD",
      platform: "Udemy",
      url: "https://www.udemy.com/course/gitlab-cicd/",
      type: "paid",
      estimatedHours: 10,
    },
    {
      title: "GitHub Actions Documentation",
      platform: "Official Docs",
      url: "https://docs.github.com/en/actions",
      type: "free",
      estimatedHours: 8,
    },
  ],
  devops: [
    {
      title: "Complete DevOps Engineer Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/complete-devops-engineer-course/",
      type: "paid",
      estimatedHours: 50,
    },
    {
      title: "DevOps Roadmap",
      platform: "GitHub",
      url: "https://github.com/kamranahmedse/devops-roadmap",
      type: "free",
      estimatedHours: 100,
    },
  ],
  linux: [
    {
      title: "Linux Command Line Basics",
      platform: "Udemy",
      url: "https://www.udemy.com/course/linux-command-line-basics/",
      type: "paid",
      estimatedHours: 12,
    },
    {
      title: "Linux Journey",
      platform: "Linux Journey",
      url: "https://linuxjourney.com/",
      type: "free",
      estimatedHours: 20,
    },
  ],
  java: [
    {
      title: "Java Programming Master Class",
      platform: "Udemy",
      url: "https://www.udemy.com/course/java-the-complete-java-developer-course/",
      type: "paid",
      estimatedHours: 40,
    },
    {
      title: "Java Official Documentation",
      platform: "Official Docs",
      url: "https://docs.oracle.com/en/java/",
      type: "free",
      estimatedHours: 30,
    },
  ],
  csharp: [
    {
      title: "Complete C# Unity Developer",
      platform: "Udemy",
      url: "https://www.udemy.com/course/complete-csharp-unity-developer/",
      type: "paid",
      estimatedHours: 44,
    },
    {
      title: "C# Documentation",
      platform: "Official Docs",
      url: "https://learn.microsoft.com/en-us/dotnet/csharp/",
      type: "free",
      estimatedHours: 30,
    },
  ],
  golang: [
    {
      title: "Go Programming Language Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/go-programming-language/",
      type: "paid",
      estimatedHours: 18,
    },
    {
      title: "Go Official Tour",
      platform: "Official Docs",
      url: "https://tour.golang.org/",
      type: "free",
      estimatedHours: 5,
    },
  ],
  rust: [
    {
      title: "The Rust Programming Language",
      platform: "Udemy",
      url: "https://www.udemy.com/course/rust-programming-language/",
      type: "paid",
      estimatedHours: 30,
    },
    {
      title: "The Rust Book",
      platform: "Official Docs",
      url: "https://doc.rust-lang.org/book/",
      type: "free",
      estimatedHours: 25,
    },
  ],
  css: [
    {
      title: "Advanced CSS and Sass",
      platform: "Udemy",
      url: "https://www.udemy.com/course/advanced-css-and-sass/",
      type: "paid",
      estimatedHours: 28,
    },
    {
      title: "CSS MDN Web Docs",
      platform: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      type: "free",
      estimatedHours: 20,
    },
  ],
  html: [
    {
      title: "HTML & CSS Bootcamp",
      platform: "Udemy",
      url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
      type: "paid",
      estimatedHours: 12,
    },
    {
      title: "HTML MDN Web Docs",
      platform: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      type: "free",
      estimatedHours: 15,
    },
  ],
  javascript: [
    {
      title: "The Complete JavaScript Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/the-complete-javascript-course/",
      type: "paid",
      estimatedHours: 69,
    },
    {
      title: "JavaScript MDN Web Docs",
      platform: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      type: "free",
      estimatedHours: 30,
    },
    {
      title: "JavaScript Fundamentals",
      platform: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
      type: "free",
      estimatedHours: 4,
    },
  ],
  vue: [
    {
      title: "Vue - The Complete Guide",
      platform: "Udemy",
      url: "https://www.udemy.com/course/vuejs-2-the-complete-guide/",
      type: "paid",
      estimatedHours: 35,
    },
    {
      title: "Vue Official Documentation",
      platform: "Official Docs",
      url: "https://vuejs.org/guide/introduction.html",
      type: "free",
      estimatedHours: 20,
    },
  ],
  angular: [
    {
      title: "Angular - The Complete Guide",
      platform: "Udemy",
      url: "https://www.udemy.com/course/the-complete-guide-to-angular-2/",
      type: "paid",
      estimatedHours: 38,
    },
    {
      title: "Angular Official Documentation",
      platform: "Official Docs",
      url: "https://angular.io/docs",
      type: "free",
      estimatedHours: 30,
    },
  ],
  agile: [
    {
      title: "Agile and Scrum Master Certification",
      platform: "Udemy",
      url: "https://www.udemy.com/course/agile-and-scrum-master-certification/",
      type: "paid",
      estimatedHours: 15,
    },
    {
      title: "Scrum Guide",
      platform: "Scrum.org",
      url: "https://scrumguides.org/",
      type: "free",
      estimatedHours: 5,
    },
  ],
  firebase: [
    {
      title: "Firebase Complete Course",
      platform: "Udemy",
      url: "https://www.udemy.com/course/firebase-complete-course/",
      type: "paid",
      estimatedHours: 20,
    },
    {
      title: "Firebase Documentation",
      platform: "Official Docs",
      url: "https://firebase.google.com/docs",
      type: "free",
      estimatedHours: 15,
    },
  ],
};

export function recommendCourses(missingSkills: string[]): CourseRecommendation[] {
  const normalized = missingSkills.map((skill) => skill.toLowerCase().trim());

  const recommendations: CourseRecommendation[] = [];
  const seen = new Set<string>();

  for (const skill of normalized) {
    // Try exact match first
    if (skill in courseDatabase && !seen.has(skill)) {
      seen.add(skill);
      recommendations.push({
        skillName: skill,
        courses: courseDatabase[skill],
      });
    } else {
      // Try partial match
      const matched = Object.keys(courseDatabase).find(
        (key) => key.includes(skill) || skill.includes(key)
      );
      if (matched && !seen.has(matched)) {
        seen.add(matched);
        recommendations.push({
          skillName: matched,
          courses: courseDatabase[matched],
        });
      }
    }
  }

  return recommendations;
}
