import { z } from 'zod';

export const techItemSchema = z.object({
  name: z.string(),
  slug: z.string(),
  desc: z.string(),
  content: z.string(),
  priority: z.number().optional(),
  icon: z.string(),
  docsUrl: z.string().optional(),
  coverImage: z.string().optional(),
  glossary: z.array(z.object({
    term: z.string(),
    definition: z.string(),
  })).optional(),
});

export const pagesSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  techStack: z.array(techItemSchema)
});

export type TechItem = z.infer<typeof techItemSchema>;
export type PagesEntry = z.infer<typeof pagesSchema>;