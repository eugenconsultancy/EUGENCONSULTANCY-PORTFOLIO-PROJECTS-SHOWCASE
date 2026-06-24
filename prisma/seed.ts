import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Upsert the profile
    await prisma.profile.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "Jane Doe",
            bio: "Full‑stack developer passionate about clean architecture and delightful UX.",
            status: "Available for hire",
            website: "https://janedoe.dev",
            github: "https://github.com/janedoe",
            linkedin: "https://linkedin.com/in/janedoe",
            twitter: "https://twitter.com/janedoe",
        },
    });

    // Create two projects with associated images
    const project1 = await prisma.project.create({
        data: {
            title: "E‑Commerce Platform",
            slug: "ecommerce-platform",
            summary: "A full‑stack online store with Stripe payments and an admin dashboard.",
            body: `## Overview

This project is a complete e‑commerce solution.

![Dashboard](/uploads/projects/sample.jpg)

### Features

- Product management
- Shopping cart
- Secure checkout with Stripe
- Order history`,
            techStack: "Next.js, TypeScript, Prisma, PostgreSQL, Stripe, Tailwind CSS",
            dependencies: "next\nreact\nprisma\n@prisma/client\nstripe\ntailwindcss\nzod",
            liveUrl: "https://shop.example.com",
            githubUrl: "https://github.com/janedoe/ecommerce",
            status: "PUBLISHED",
            displayOrder: 1,
            images: {
                create: [
                    { filename: "sample.jpg", alt: "Dashboard preview", isMain: true },
                ],
            },
        },
    });

    const project2 = await prisma.project.create({
        data: {
            title: "Task Manager API",
            slug: "task-manager-api",
            summary: "A RESTful API for task management with JWT authentication.",
            body: `## Overview

This API provides endpoints for managing tasks.

![Architecture](/uploads/projects/sample.jpg)

### Endpoints

- **GET** /tasks
- **POST** /tasks
- **PATCH** /tasks/:id
- **DELETE** /tasks/:id`,
            techStack: "Node.js, Express, TypeScript, MongoDB, JWT",
            dependencies: "express\ntypescript\nmongoose\njsonwebtoken\nzod",
            liveUrl: "https://api.example.com",
            githubUrl: "https://github.com/janedoe/task-manager",
            status: "PUBLISHED",
            displayOrder: 2,
            images: {
                create: [
                    { filename: "sample.jpg", alt: "API architecture", isMain: true },
                ],
            },
        },
    });

    console.log("Seed data created:");
    console.log(`  Profile: Jane Doe`);
    console.log(`  Project 1: ${project1.title} (${project1.id})`);
    console.log(`  Project 2: ${project2.title} (${project2.id})`);
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