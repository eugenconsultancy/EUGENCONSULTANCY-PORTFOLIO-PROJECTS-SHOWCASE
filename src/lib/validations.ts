import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0),
  timestamp: z.string(),
});

export const commentSchema = z.object({
  projectId: z.number(),
  parentId: z.number().nullable().optional(),
  name: z.string().min(1),
  content: z.string().min(3),
  honeypot: z.string().max(0),
  timestamp: z.string(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  body: z.string(),
  techStack: z.string(),
  dependencies: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  displayOrder: z.number().int().optional(),
  problem: z.string().optional(),
  approach: z.string().optional(),
  result: z.string().optional(),
  metrics: z.string().optional(),
  beforeImageId: z.number().int().optional(),
  afterImageId: z.number().int().optional(),
  frameworkRationale: z.string().optional(),   // new
});

export const profileSchema = z.object({
  name: z.string().min(1),
  bio: z.string(),
  status: z.string().optional(),
  skills: z.string().optional(),
  certifications: z.string().optional(),
  availability: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  radarJson: z.string().optional(),
});

export const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const certificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  verificationUrl: z.string().url().optional().or(z.literal("")),
});
