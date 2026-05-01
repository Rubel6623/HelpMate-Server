import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }),
    slug: z.string({
      message: 'Slug is required',
    }),
    content: z.string({
      message: 'Content is required',
    }),
    excerpt: z.string({
      message: 'Excerpt is required',
    }).max(255),
    category: z.enum(['EARNING', 'PRODUCTIVITY', 'SAFETY', 'LIFESTYLE']),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    readTimeMin: z.number().optional(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    content: z.string().optional(),
    excerpt: z.string().max(255).optional(),
    category: z.enum(['EARNING', 'PRODUCTIVITY', 'SAFETY', 'LIFESTYLE']).optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    readTimeMin: z.number().optional(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

export const BlogValidation = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
