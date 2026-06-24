import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ═══════════════════════════════════════
  // 1. PROFILE (upsert – safe to re‑run)
  // ═══════════════════════════════════════
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "EUGENCONSULTANCY",
      bio: `I'm a results-driven Full-Stack Developer delivering production-grade web, mobile, and desktop applications across education, agriculture, healthcare, sports analytics, and real-time communications sectors. My technical foundation spans Python (Django, Django Ninja, FastAPI, Tornado), JavaScript (React, React Native, Vue.js 3, Next.js), and Dart (Flutter), with expertise in modern state management (Redux, Zustand, Pinia) and styling frameworks (Tailwind CSS, Material UI, Bootstrap 5).

I architect and deploy scalable backend systems using Django Ninja for high-performance REST APIs, Django Channels for WebSocket communication, Celery with Redis for asynchronous task processing, and PostgreSQL with advanced query optimization. My frontend work emphasises performance through React memoization, code splitting, lazy loading, and bundle size optimisation.

I bring proven database expertise across PostgreSQL, MySQL, SQLite, and Redis caching, designing optimised schemas with proper indexing, connection pooling, and query profiling. My API development follows OpenAPI 3.0 standards with comprehensive Postman documentation, JWT authentication with refresh token rotation, and rate limiting. I implement CI/CD pipelines via GitHub Actions, containerise applications with Docker, and deploy across Vercel, Render, Heroku, PythonAnywhere, AWS (EC2, S3, Rekognition), and traditional VPS setups with Nginx/Gunicorn.

For data analysis, I leverage Python (Pandas, NumPy, SciPy, Statsmodels) and SPSS for statistical testing, paired with Matplotlib and Plotly for interactive visualisations. For technical SEO, I practice exclusively White Hat SEO, specialising in keyword research, on-page optimisation, Core Web Vitals, and AI-driven content strategy. I also guide clients in setting up Google Search Console and evaluating metrics for enhanced ranking.

I enhance WordPress UI through custom theme development with Tailwind CSS and plugin optimisation. I strictly avoid Blackhat techniques, focusing on sustainable, ethical optimisation for long-term and consistent ranking.`,
      status: "Available for hire",
      skills: "Python, JavaScript (ES6+), TypeScript, Dart, HTML5, CSS3, Django, Django Ninja, Django REST Framework, FastAPI, Tornado, Flask, PHP, React 18/19, React Native, Vue.js 3, Next.js, Angular.js, Vite, Docker, Nginx, Gunicorn, GitHub Actions, Vercel, Render, AWS (EC2, S3, Rekognition), PythonAnywhere, Heroku, Tailwind CSS, Material UI, Bootstrap 5, SASS, Styled Components, WebSockets, Django Channels, Redis Pub/Sub, WebRTC, REST, JSON, OpenAPI 3.0, Swagger, Postman, JWT, OAuth 2.0, OTP, 2FA/TOTP, Biometric (AWS Rekognition), PostgreSQL, MySQL, SQLite, MongoDB, Elasticsearch, Redis, Celery, M-Pesa Daraja API, Stripe, PayPal, Jest, React Testing Library, Pytest, Django TestCase, scikit-learn, Pandas, NumPy, SciPy, Statsmodels, Matplotlib, Plotly, SPSS, React.memo, useMemo, useCallback, Code Splitting, Lazy Loading, Database Indexing, Connection Pooling, Redis Caching, Query Profiling, SEMrush, Ahrefs, Schema Markup, RankMath, Yoast SEO, AI SEO Strategy, Tkinter, Pillow, WhiteNoise, Sentry, Git, GitHub, GitLab",
      certifications: "Certified Web Professional — Web Developer (CWP) – World Organization of Webmasters\nFlutter Dart Certified Professional – Kenya School of IT\nDjango REST Framework — Advanced API Development – Udemy\nVue.js 3 — Complete Developer Course – Udemy\nTornado and Tkinter Developer Course – Emobilis Technology College",
      availability: "I am immediately available for full-time, contract, and freelance engagements. I thrive in remote-first environments and am open to relocation for the right opportunity. My ideal engagement is a product team where I can own features end-to-end — from database schema to polished UI — and directly influence user outcomes.",
      website: "https://vercel.com/eugen-consultancy",
      github: "https://github.com/eugenconsultancy",
      linkedin: "https://www.linkedin.com/in/eugen-gachie",
      twitter: "https://twitter.com/eugenconsultancy",
    },
  });

  // ═══════════════════════════════════════
  // 2. EXPERIENCES (delete & recreate)
  // ═══════════════════════════════════════
  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.experience.createMany({
    data: [
      {
        profileId: profile.id,
        title: "Senior Full-Stack Developer",
        company: "Eugen Consultancy",
        startDate: "2020-01-01",
        endDate: null,
        description: "Delivering production-grade applications across multiple industries. Leading remote teams and architecting scalable cloud solutions.",
      },
      {
        profileId: profile.id,
        title: "Software Engineer",
        company: "Agri-Tech Solutions",
        startDate: "2018-06-01",
        endDate: "2019-12-31",
        description: "Developed mobile and web platforms for agricultural management, integrating M-Pesa payments and real-time weather data.",
      },
      {
        profileId: profile.id,
        title: "Junior Web Developer",
        company: "Nairobi Web Studio",
        startDate: "2016-03-01",
        endDate: "2018-05-31",
        description: "Built custom WordPress themes, SEO-optimised marketing sites, and maintained internal tools.",
      },
    ],
  });

  // ═══════════════════════════════════════
  // 3. CERTIFICATIONS
  // ═══════════════════════════════════════
  await prisma.certification.deleteMany({ where: { profileId: profile.id } });
  await prisma.certification.createMany({
    data: [
      {
        profileId: profile.id,
        title: "Certified Web Professional — Web Developer (CWP)",
        issuer: "World Organization of Webmasters",
        date: "2024",
        verificationUrl: "https://www.example.com/verify",
      },
      {
        profileId: profile.id,
        title: "Flutter Dart Certified Professional",
        issuer: "Kenya School of IT",
        date: "2023",
        verificationUrl: "https://www.example.com/verify",
      },
      {
        profileId: profile.id,
        title: "Django REST Framework — Advanced API Development",
        issuer: "Udemy",
        date: "2022",
        verificationUrl: "https://www.example.com/verify",
      },
      {
        profileId: profile.id,
        title: "Vue.js 3 — Complete Developer Course",
        issuer: "Udemy",
        date: "2022",
        verificationUrl: "https://www.example.com/verify",
      },
      {
        profileId: profile.id,
        title: "Tornado and Tkinter Developer Course",
        issuer: "Emobilis Technology College",
        date: "2021",
        verificationUrl: "https://www.example.com/verify",
      },
    ],
  });

  console.log("✅ EUGENCONSULTANCY profile, experiences, and certifications seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
