import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Delete existing services to avoid duplicates (order matters due to foreign keys)
    await prisma.serviceTestimonial.deleteMany();
    await prisma.serviceInquiry.deleteMany();
    await prisma.service.deleteMany();

    const services = [
        {
            title: "SPSS Data Analysis & Statistical Consulting",
            slug: "spss-data-analysis",
            category: "Data Analytics",
            summary: "Professional statistical analysis using SPSS for research, business intelligence, and academic projects. From data cleaning to advanced modeling.",
            description: `Transform your raw data into actionable insights with professional SPSS statistical analysis. I specialize in comprehensive data analysis services for researchers, businesses, and academic institutions.

Whether you're working on a thesis, research paper, business report, or market analysis, I provide end-to-end SPSS consulting — from data preparation and cleaning to advanced statistical modeling and interpretation.

My expertise covers descriptive statistics, inferential analysis, regression modeling, factor analysis, ANOVA, chi-square tests, and custom SPSS syntax automation. I deliver clean, well-documented outputs with clear visualizations and plain-English explanations of your results.`,
            icon: "📊",
            features: JSON.stringify([
                "Descriptive statistics (mean, median, mode, standard deviation)",
                "Inferential statistics (t-tests, ANOVA, chi-square, correlation)",
                "Regression analysis (linear, logistic, multiple)",
                "Factor analysis and PCA",
                "Reliability analysis (Cronbach's alpha)",
                "Data cleaning and preprocessing",
                "Custom SPSS syntax and automation",
                "APA-formatted tables and reports",
                "Survey data analysis",
                "Time series analysis",
                "Cluster analysis and segmentation",
                "Power analysis and sample size calculation"
            ]),
            tools: JSON.stringify([
                "IBM SPSS Statistics",
                "SPSS Amos (SEM)",
                "Python (Pandas, NumPy, SciPy)",
                "R Statistical Software",
                "Microsoft Excel",
                "Tableau",
                "Power BI"
            ]),
            benefits: JSON.stringify([
                "Accurate, peer-review-ready statistical results",
                "Clear interpretation in plain English",
                "APA-formatted tables and charts",
                "Fast turnaround (24-72 hours for standard projects)",
                "Unlimited revisions until you're satisfied",
                "Confidential and secure data handling",
                "Ongoing support for thesis/research defense"
            ]),
            process: JSON.stringify([
                { step: "Initial Consultation", description: "Discuss your research questions, hypotheses, and data requirements" },
                { step: "Data Assessment", description: "Review your dataset for completeness, accuracy, and appropriate structure" },
                { step: "Analysis Plan", description: "Design the statistical approach and select appropriate tests" },
                { step: "Data Analysis", description: "Execute statistical tests using SPSS with rigorous quality checks" },
                { step: "Results Interpretation", description: "Provide detailed interpretation of all statistical outputs" },
                { step: "Report Delivery", description: "Deliver formatted tables, charts, and a comprehensive analysis report" },
                { step: "Revision & Support", description: "Address feedback and provide clarification for your defense or publication" }
            ]),
            pricing: JSON.stringify({
                basic: { name: "Basic Analysis", price: "$50-150", features: ["Descriptive stats", "Basic tests", "1 revision"] },
                standard: { name: "Standard Analysis", price: "$150-400", features: ["Advanced tests", "Regression", "Full report", "3 revisions"] },
                premium: { name: "Premium Analysis", price: "$400-800+", features: ["Complex modeling", "Factor analysis", "APA report", "Unlimited revisions", "Defense support"] }
            }),
            status: "PUBLISHED",
            displayOrder: 1,
        },
        {
            title: "Search Engine Optimization (SEO) Services",
            slug: "seo-services",
            category: "SEO",
            summary: "White-hat SEO strategies to boost your organic rankings, drive qualified traffic, and increase conversions. Ethical, sustainable, and results-driven.",
            description: `Dominate search engine results with ethical, white-hat SEO strategies that deliver sustainable growth. I specialize in technical SEO, on-page optimization, and data-driven content strategies that align with Google's E-E-A-T guidelines.

My approach combines technical audits, keyword research, content optimization, and performance monitoring to create a comprehensive SEO strategy tailored to your business goals. Unlike black-hat practitioners, I focus on long-term results through quality content, proper site architecture, and genuine user value.

Whether you need a full SEO overhaul, targeted keyword optimization, or ongoing consulting, I provide transparent, measurable results with regular reporting and clear communication.`,
            icon: "🔍",
            features: JSON.stringify([
                "Technical SEO audits (Core Web Vitals, site speed, mobile optimization)",
                "Keyword research and competitor analysis",
                "On-page SEO optimization (meta tags, headings, content structure)",
                "Schema markup implementation (JSON-LD, structured data)",
                "Content strategy and AI-assisted content creation",
                "Link building and outreach strategies",
                "Local SEO optimization (Google Business Profile)",
                "SEO-friendly web development (Next.js, WordPress)",
                "Google Search Console & Analytics setup",
                "Regular ranking reports and performance tracking",
                "Site migration SEO support",
                "E-commerce SEO optimization"
            ]),
            tools: JSON.stringify([
                "Google Search Console",
                "Google Analytics 4",
                "SEMrush",
                "Ahrefs",
                "Screaming Frog",
                "Yoast SEO / RankMath",
                "Schema Markup Generator",
                "PageSpeed Insights",
                "GTmetrix",
                "Moz Pro"
            ]),
            benefits: JSON.stringify([
                "Ethical, white-hat strategies (no penalties risk)",
                "Improved organic search visibility",
                "Higher-quality, converting traffic",
                "Better user experience and site performance",
                "Measurable ROI with transparent reporting",
                "Competitive advantage in your niche",
                "Sustainable long-term results"
            ]),
            process: JSON.stringify([
                { step: "SEO Audit", description: "Comprehensive analysis of your current SEO performance and technical health" },
                { step: "Strategy Development", description: "Custom SEO roadmap based on your industry, competition, and goals" },
                { step: "Keyword Research", description: "Identify high-value, achievable keywords with strong commercial intent" },
                { step: "On-Page Optimization", description: "Optimize content, meta tags, headings, and internal linking structure" },
                { step: "Technical SEO", description: "Fix crawl errors, improve site speed, implement structured data" },
                { step: "Content Strategy", description: "Create and optimize content that ranks and converts" },
                { step: "Monitoring & Reporting", description: "Track rankings, traffic, and conversions with monthly reports" },
                { step: "Continuous Optimization", description: "Iterate based on data, algorithm updates, and competitive landscape" }
            ]),
            pricing: JSON.stringify({
                basic: { name: "SEO Audit", price: "$200-500", features: ["Technical audit", "Keyword research", "Action plan"] },
                standard: { name: "Monthly SEO", price: "$500-1,500/mo", features: ["On-page optimization", "Content strategy", "Monthly reports", "Link building"] },
                premium: { name: "Enterprise SEO", price: "$1,500-5,000/mo", features: ["Full-service SEO", "Content creation", "Technical maintenance", "Weekly reports", "CRO integration"] }
            }),
            status: "PUBLISHED",
            displayOrder: 2,
        },
        {
            title: "Penetration Testing & Security Auditing",
            slug: "penetration-testing",
            category: "Security",
            summary: "Comprehensive penetration testing and security assessments for web applications, APIs, and networks. Identify vulnerabilities before attackers do.",
            description: `Protect your digital assets with professional penetration testing and security auditing services. I conduct thorough security assessments to identify vulnerabilities in your web applications, APIs, mobile apps, and network infrastructure before malicious actors can exploit them.

My testing methodology follows industry standards (OWASP, NIST, PTES) and covers everything from automated vulnerability scanning to manual exploitation and post-exploitation analysis. Each engagement includes a detailed report with risk ratings, proof-of-concept demonstrations, and prioritized remediation recommendations.

Whether you need compliance testing (PCI DSS, HIPAA, SOC 2), pre-launch security review, or ongoing security monitoring, I provide actionable insights to strengthen your security posture.`,
            icon: "🛡️",
            features: JSON.stringify([
                "Web application penetration testing (OWASP Top 10)",
                "API security testing (REST, GraphQL, WebSocket)",
                "Network vulnerability assessment",
                "Authentication and authorization testing",
                "SQL injection, XSS, CSRF testing",
                "Security misconfiguration detection",
                "Sensitive data exposure analysis",
                "Business logic vulnerability assessment",
                "Social engineering simulations",
                "Wireless network security testing",
                "Cloud infrastructure security review (AWS, Azure)",
                "Compliance auditing (PCI DSS, HIPAA, SOC 2)"
            ]),
            tools: JSON.stringify([
                "Burp Suite Professional",
                "OWASP ZAP",
                "Nmap",
                "Metasploit",
                "Wireshark",
                "SQLmap",
                "Hydra",
                "John the Ripper",
                "Nessus",
                "Nikto",
                "DirBuster",
                "Kali Linux"
            ]),
            benefits: JSON.stringify([
                "Identify vulnerabilities before attackers do",
                "Detailed reports with risk ratings and remediation steps",
                "Proof-of-concept demonstrations",
                "Compliance-ready documentation",
                "Prioritized action plan for security improvements",
                "Confidential and secure engagement",
                "Post-remediation validation testing"
            ]),
            process: JSON.stringify([
                { step: "Scoping", description: "Define testing scope, rules of engagement, and objectives" },
                { step: "Reconnaissance", description: "Gather information about target systems and applications" },
                { step: "Vulnerability Scanning", description: "Automated scanning to identify potential vulnerabilities" },
                { step: "Manual Testing", description: "Hands-on exploitation and validation of discovered vulnerabilities" },
                { step: "Post-Exploitation", description: "Assess impact and potential lateral movement" },
                { step: "Reporting", description: "Comprehensive report with findings, risk levels, and remediation guidance" },
                { step: "Remediation Support", description: "Assist your development team in fixing identified vulnerabilities" },
                { step: "Re-testing", description: "Verify that fixes are effective and no new vulnerabilities introduced" }
            ]),
            pricing: JSON.stringify({
                basic: { name: "Web App Test", price: "$500-1,500", features: ["OWASP Top 10 testing", "Automated + manual", "Basic report"] },
                standard: { name: "Full Assessment", price: "$1,500-5,000", features: ["Web + API testing", "Network scan", "Detailed report", "Remediation support"] },
                premium: { name: "Enterprise", price: "$5,000-15,000+", features: ["Full-scope testing", "Cloud review", "Social engineering", "Compliance report", "Retesting"] }
            }),
            status: "PUBLISHED",
            displayOrder: 3,
        },
        {
            title: "Professional Blogging & Content Strategy",
            slug: "blogging-content-strategy",
            category: "Content",
            summary: "SEO-optimized blog writing, content strategy, and editorial management for tech, SaaS, and professional services brands.",
            description: `Elevate your brand with professional blogging and content strategy services. I create engaging, SEO-optimized content that establishes your authority, drives organic traffic, and converts readers into customers.

With expertise in technical writing, thought leadership, and content marketing, I help businesses and professionals build a strong online presence through strategic content. My approach combines deep research, SEO best practices, and compelling storytelling to create content that resonates with your target audience.

From blog posts and white papers to case studies and technical documentation, I deliver content that's accurate, engaging, and optimized for both search engines and human readers.`,
            icon: "✍️",
            features: JSON.stringify([
                "SEO-optimized blog writing",
                "Content strategy development",
                "Technical writing and documentation",
                "Thought leadership articles",
                "Case studies and success stories",
                "White papers and e-books",
                "Newsletter content creation",
                "Social media content planning",
                "Content calendar management",
                "Keyword-optimized content briefs",
                "Competitor content analysis",
                "Content performance analytics"
            ]),
            tools: JSON.stringify([
                "WordPress",
                "Ghost CMS",
                "SEMrush Writing Assistant",
                "Grammarly",
                "Hemingway Editor",
                "Google Docs",
                "Notion",
                "Surfer SEO",
                "Frase.io",
                "Clearscope"
            ]),
            benefits: JSON.stringify([
                "Consistent, high-quality content publishing",
                "Improved search engine rankings",
                "Established industry authority",
                "Increased organic traffic",
                "Higher engagement and social shares",
                "Better lead generation and conversion",
                "Scalable content strategy"
            ]),
            process: JSON.stringify([
                { step: "Content Audit", description: "Review existing content and identify gaps and opportunities" },
                { step: "Strategy Development", description: "Create content strategy aligned with business goals and SEO targets" },
                { step: "Topic Research", description: "Identify high-value topics based on keyword research and audience needs" },
                { step: "Content Creation", description: "Write engaging, SEO-optimized content with proper structure and formatting" },
                { step: "Review & Revision", description: "Collaborative review process with unlimited revisions" },
                { step: "Publishing & Distribution", description: "Format for your CMS, optimize meta data, and distribution strategy" },
                { step: "Performance Tracking", description: "Monitor content performance and adjust strategy based on data" }
            ]),
            pricing: JSON.stringify({
                basic: { name: "Blog Posts", price: "$100-300/post", features: ["1,000-2,000 words", "SEO optimized", "2 revisions", "1 image"] },
                standard: { name: "Content Package", price: "$500-1,500/mo", features: ["4 blog posts", "Content strategy", "Keyword research", "Monthly report"] },
                premium: { name: "Full Content Suite", price: "$1,500-5,000/mo", features: ["8+ blog posts", "Content strategy", "White papers", "Social media", "Performance analytics"] }
            }),
            status: "PUBLISHED",
            displayOrder: 4,
        },
    ];

    for (const service of services) {
        await prisma.service.create({ data: service });
    }

    console.log("✅ Services seeded successfully!");
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