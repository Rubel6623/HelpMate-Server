import { Blog, BlogStatus, Prisma } from '../../../generated/prisma';
import { prisma } from '../../lib/prisma';
import { IBlogFilterRequest } from './blogs.interface';
import { blogSearchableFields } from './blogs.constant';

const createBlog = async (authorId: string, payload: Blog) => {
  const result = await prisma.blog.create({
    data: {
      ...payload,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
  return result;
};

const getAllBlogs = async (filters: IBlogFilterRequest) => {
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    where: whereConditions,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const getSingleBlog = async (id: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
  return result;
};

const getBlogBySlug = async (slug: string) => {
  const result = await prisma.blog.findUniqueOrThrow({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
  
  // Increment view count when fetching by slug (reading)
  await prisma.blog.update({
    where: { slug },
    data: {
      viewCount: {
        increment: 1
      }
    }
  });

  return result;
};

const updateBlog = async (id: string, payload: Partial<Blog>) => {
  // If status is being updated to PUBLISHED, set publishedAt if not already set
  if (payload.status === BlogStatus.PUBLISHED && !payload.publishedAt) {
    payload.publishedAt = new Date();
  }

  const result = await prisma.blog.update({
    where: { id },
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });
  return result;
};

const deleteBlog = async (id: string) => {
  const result = await prisma.blog.delete({
    where: { id },
  });
  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
