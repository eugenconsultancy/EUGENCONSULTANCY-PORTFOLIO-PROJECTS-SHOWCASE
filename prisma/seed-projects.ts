import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Delete existing projects if you want a fresh start (optional – remove this if you want to keep existing ones)
    // await prisma.project.deleteMany();

    const projects = [
        {
            title: "OurChat - Real-Time Communication Platform",
            slug: "ourchat-real-time-communication",
            summary: "A real-time chat and video calling platform supporting 1,000+ users, 2,500+ daily messages, and 200+ video sessions with <100ms WebSocket latency.",
            body: `## Overview\nOurChat is a real-time communication platform designed for seamless messaging and video calls.\n\n## Key Features\n- WebSocket-powered instant messaging\n- Group video calls with up to 50 participants\n- File sharing and rich media support\n- End-to-end encryption\n- User presence and typing indicators\n\n## Technology\nBuilt with Django Channels for WebSocket handling, React for the frontend, and PostgreSQL for data storage.`,
            techStack: "Django, Django Channels, React, PostgreSQL, Redis, WebRTC",
            dependencies: null,
            liveUrl: "https://ourchat.example.com",
            githubUrl: "https://github.com/yourusername/ourchat",
            status: "PUBLISHED",
            displayOrder: 1,
            frameworkRationale: "Django Channels enables real-time WebSocket communication without additional servers. React provides a reactive UI for instant messaging. Redis handles message brokering and caching.",
            problem: "Users needed a fast, reliable communication platform with real-time messaging and video calls. Existing solutions were either too complex or lacked WebSocket support.",
            approach: "We used Django Channels for persistent WebSocket connections, Redis as a channel layer for message routing, and React with WebRTC for video calling. Celery handles background tasks like file uploads.",
            result: "The platform now supports 350+ daily active users with <100ms latency. Video calls run smoothly with 200+ sessions daily. User retention is 78% month-over-month.",
            metrics: "User Growth: 1,000+ registered users in first month\nActive Users: 350+ daily active users\nChat Messages: 2,500+ messages per day\nVideo Calls: 200+ daily call sessions\nResponse Time: <100ms WebSocket latency\nUptime: 99.9% availability\nUser Retention: 78% month-over-month retention\nNPS Score: 72 (Excellent)",
        },
        {
            title: "HospitalFlow - Integrated Healthcare Management System",
            slug: "hospitalflow-healthcare-management",
            summary: "A comprehensive healthcare management platform with 5,000+ users, 3,500+ weekly appointments, and 92% revenue collection rate.",
            body: `## Overview\nHospitalFlow streamlines hospital operations including patient registration, appointment scheduling, billing, and clinical documentation.\n\n## Key Features\n- Patient and provider portals\n- Appointment booking and reminders\n- Integrated billing with insurance claims\n- Electronic health records (EHR) module\n- Analytics dashboard for administrators\n\n## Technology\nBuilt with Django REST Framework, React, PostgreSQL, and Redis. Real-time updates via WebSockets.`,
            techStack: "Django, Django REST Framework, React, PostgreSQL, Redis, Celery, Docker",
            dependencies: null,
            liveUrl: "https://hospitalflow.example.com",
            githubUrl: "https://github.com/yourusername/hospitalflow",
            status: "PUBLISHED",
            displayOrder: 2,
            frameworkRationale: "Django's admin and ORM handle complex healthcare data models. DRF provides a robust API for the React frontend. Celery processes async tasks like claim submissions.",
            problem: "Hospitals faced inefficient manual processes, low revenue collection (industry average 85%), and poor patient retention. Staff spent hours on paperwork rather than patient care.",
            approach: "We designed a modular system with role-based dashboards. Appointment scheduling uses Celery for reminders. Insurance claim submission is automated via DRF. WebSockets provide real-time bed availability updates.",
            result: "Revenue collection improved to 92%. Patient satisfaction is 4.8/5. Staff retention increased by 15%. The system now handles 3,500+ appointments weekly with 99.9% uptime.",
            metrics: "User Growth: 5,000+ registered users in first 6 months\nActive Users: 1,200+ daily active users\nAppointments: 3,500+ weekly appointments\nPatient Satisfaction: 4.8/5 average rating\nProvider Satisfaction: 4.6/5 average rating\nSystem Response Time: <500ms average\nData Accuracy: 99.8% accuracy in clinical documentation\nRevenue Collection: 92% collection rate (industry average: 85%)\nInsurance Claim Approval Rate: 85% (industry average: 72%)\nStaff Retention: 15% improvement in retention\nPatient Retention: 30% increase in returning patients",
        },
        {
            title: "Microbiology Diagnostic Decision Support System",
            slug: "microbiology-diagnostic-decision-support-system",
            summary: "An AI-powered diagnostic support system for microbiology labs, with 150+ organisms, 85% identification accuracy, and 6 specialized algorithms.",
            body: `## Overview\nAn intelligent diagnostic decision support system that assists microbiology laboratories in identifying microorganisms based on observed test results and clinical features.\n\n## Key Features\n- Comprehensive knowledge base (150+ microorganisms)\n- Rule-based decision engine with weighted scoring\n- Uncertainty analysis and test suggestions\n- API-first architecture with JWT authentication\n- Clinical validation framework with audit logging\n\n## Technology\nBuilt with Django, Django REST Framework, Celery, Redis, PostgreSQL, and React.`,
            techStack: "Django, Django REST Framework, Celery, Redis, PostgreSQL, React, Docker",
            dependencies: null,
            liveUrl: "https://microbiodiagnostic.com",
            githubUrl: "https://github.com/yourusername/microbio-diagnostic-tool",
            status: "PUBLISHED",
            displayOrder: 3,
            frameworkRationale: "Django's admin handles knowledge base management. DRF provides a scalable API. Celery processes validation tasks. React delivers an interactive diagnostic interface.",
            problem: "Microbiology labs struggle with manual identification workflows, leading to diagnostic errors (30% error rate with manual methods). Knowledge is scattered, and training takes 6-12 months.",
            approach: "We built a rule-based decision engine with weighted scoring and hard elimination rules. Six specialized algorithms target different organism groups. An information gain-based test suggestion engine recommends next diagnostic tests.",
            result: "Identification accuracy improved to 85% (vs 70% manual). Identification time reduced by 45%. The system now handles 500+ sessions monthly with a 4.7/5 user satisfaction rating.",
            metrics: "Knowledge Base: 150+ microorganisms cataloged\nDiagnostic Features: 50+ features with categorical values\nValidation Cases: 100+ diagnostic cases for testing\nSpecialized Algorithms: 6 algorithms for different organism types\nDiagnostic Rules: 30+ rules in the decision engine\nIdentification Accuracy: 85% accuracy (vs 70% manual methods)\nProcessing Time: <500ms average identification time\nSystem Uptime: 99.9% over 6 months\nUser Satisfaction: 4.7/5 average rating\nValidation Success Rate: 85% on test cases",
        },
        {
            title: "M-Pesa Finance Manager – Full-Stack Financial Platform (Django + Vue)",
            slug: "mpesa-finance-manager-fullstack",
            summary: "A full-stack financial management platform integrating M-Pesa Daraja API, AI-powered analytics, real-time WebSockets, and Vue 3 frontend.",
            body: `## Overview\nA complete financial management platform with Django backend (REST API + WebSockets) and Vue 3 frontend. Integrates M-Pesa STK Push for payments and uses AI for spending insights.\n\n## Key Features\n- M-Pesa payment integration (STK Push)\n- Real-time transaction notifications via WebSockets\n- Budget tracking and savings goals\n- AI-driven spending predictions and anomaly detection\n- JWT authentication and role-based access\n\n## Technology\nBackend: Django, DRF, Django Channels, Celery, Redis, PostgreSQL. Frontend: Vue 3, Pinia, Axios, Tailwind CSS.`,
            techStack: "Django, Django REST Framework, Django Channels, Celery, Redis, PostgreSQL, Vue 3, Vue Router, Pinia, Axios, Tailwind CSS",
            dependencies: null,
            liveUrl: "https://mpesafinance.com",
            githubUrl: "https://github.com/yourusername/mpesa-finance-manager",
            status: "PUBLISHED",
            displayOrder: 4,
            frameworkRationale: "Django provides a secure backend with ORM and authentication. DRF enables a REST API. Channels add WebSockets for real-time updates. Vue 3 offers a reactive SPA frontend. Pinia manages state efficiently.",
            problem: "Users in Kenya needed an automated way to track M-Pesa spending, stick to budgets, and achieve savings goals without manual spreadsheets. Existing solutions lacked real-time integration and AI insights.",
            approach: "We used Django with DRF for API, Celery for background tasks, and M-Pesa Daraja API for payments. The Vue frontend communicates with the API via Axios. WebSockets push live notifications.",
            result: "The platform processes 10,000+ transactions monthly with >95% payment success rate. Users report 30% higher retention due to AI insights. Budget adherence is 85%.",
            metrics: "Payment Success Rate: >95% of STK Push requests complete\nAPI Response Time: Average <150ms for authenticated endpoints\nWebSocket Concurrency: Supports hundreds of simultaneous connections\nUser Engagement: AI insights and real-time alerts increase user retention by 30%\nTransaction Volume: 10,000+ transactions processed monthly\nBudget Adherence: 85% of users stay within budget limits\nSavings Goal Completion: 65% of goals achieved on or before deadline\nSystem Uptime: 99.9% availability\nAnomaly Detection Accuracy: 92% accuracy in identifying unusual spending",
        },
    ];

    for (const project of projects) {
        // Upsert by slug to avoid duplicates if run multiple times
        await prisma.project.upsert({
            where: { slug: project.slug },
            update: {
                ...project,
            },
            create: {
                ...project,
            },
        });
    }

    console.log(`✅ Successfully seeded ${projects.length} projects.`);
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