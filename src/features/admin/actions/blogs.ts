"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { auth } from "@/auth";
import { BLOGS_LIST_CACHE_TAG } from "@/lib/blogs-list-data";
import { prisma } from "@/lib/prisma";
import { assignInferredBlogTopic } from "@/lib/sync-blog-category";
import { isMediumArticleUrl } from "@/lib/external-content";

export type BlogsActionState = { ok: boolean; message: string } | null;

function formString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return v == null ? "" : String(v);
}

function checkboxOn(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

async function uniqueBlogSlug(base: string, excludeId?: string): Promise<string> {
  const baseSlug =
    slugify(base, { lower: true, strict: true, trim: true }) || "post";
  let candidate = baseSlug;
  let n = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${baseSlug}-${n}`;
  }
}

function mediumStubContent(mediumUrl: string): string {
  return `_This article is published on Medium._ [**Read the full story →**](${mediumUrl.trim()})`;
}

const blogCore = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().min(1).max(8000),
  mediumUrl: z
    .string()
    .trim()
    .min(1)
    .refine((s) => {
      try {
        const u = new URL(s);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Invalid URL")
    .refine(isMediumArticleUrl, "Paste a Medium article link (medium.com)"),
});

export async function blogsFormAction(
  _prev: BlogsActionState,
  formData: FormData,
): Promise<BlogsActionState> {
  const intent = String(formData.get("_intent") ?? "create");
  if (intent === "update") return updateBlogAction(_prev, formData);
  return createBlogAction(_prev, formData);
}

export async function createBlogAction(
  _prev: BlogsActionState,
  formData: FormData,
): Promise<BlogsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const parsed = blogCore.safeParse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    excerpt: formString(formData, "excerpt"),
    mediumUrl: formString(formData, "mediumUrl"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid blog data.",
    };
  }

  const published = checkboxOn(formData, "published");
  const featured = checkboxOn(formData, "featured");
  const slugInput = parsed.data.slug?.trim();
  const slug = await uniqueBlogSlug(slugInput || parsed.data.title);
  const mediumUrl = parsed.data.mediumUrl.trim();
  const content = mediumStubContent(mediumUrl);

  try {
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: parsed.data.title.trim(),
        excerpt: parsed.data.excerpt.trim(),
        content,
        canonicalUrl: mediumUrl,
        published,
        featured,
        publishedAt: published ? new Date() : null,
        readingTimeMinutes: null,
      },
    });
    await assignInferredBlogTopic(
      post.id,
      post.title,
      post.excerpt,
    );
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidateTag(BLOGS_LIST_CACHE_TAG);
    return { ok: true, message: "Blog post created." };
  } catch {
    return { ok: false, message: "Could not create post." };
  }
}

export async function updateBlogAction(
  _prev: BlogsActionState,
  formData: FormData,
): Promise<BlogsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  const parsed = blogCore.safeParse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    excerpt: formString(formData, "excerpt"),
    mediumUrl: formString(formData, "mediumUrl"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid blog data.",
    };
  }

  const published = checkboxOn(formData, "published");
  const featured = checkboxOn(formData, "featured");
  const slugInput = parsed.data.slug?.trim();
  const slug = await uniqueBlogSlug(slugInput || parsed.data.title, id);
  const mediumUrl = parsed.data.mediumUrl.trim();
  const content = mediumStubContent(mediumUrl);

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { ok: false, message: "Post not found." };

    await prisma.blogPost.update({
      where: { id },
      data: {
        slug,
        title: parsed.data.title.trim(),
        excerpt: parsed.data.excerpt.trim(),
        content,
        canonicalUrl: mediumUrl,
        published,
        featured,
        publishedAt: published
          ? existing.publishedAt ?? new Date()
          : null,
      },
    });
    await assignInferredBlogTopic(
      id,
      parsed.data.title.trim(),
      parsed.data.excerpt.trim(),
    );
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${existing.slug}`);
    revalidatePath(`/blogs/${slug}`);
    revalidateTag(BLOGS_LIST_CACHE_TAG);
    return { ok: true, message: "Blog post updated." };
  } catch {
    return { ok: false, message: "Could not update post." };
  }
}

export async function deleteBlogAction(
  _prev: BlogsActionState,
  formData: FormData,
): Promise<BlogsActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sign in required." };

  const id = formString(formData, "id");
  if (!id) return { ok: false, message: "Missing id." };

  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { ok: false, message: "Not found." };
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${post.slug}`);
    revalidateTag(BLOGS_LIST_CACHE_TAG);
    return { ok: true, message: "Deleted." };
  } catch {
    return { ok: false, message: "Could not delete." };
  }
}

/** For `<form action={...}>` without `useActionState` — matches React form action arity. */
export async function deleteBlogPostFormAction(formData: FormData) {
  await deleteBlogAction(null, formData);
}
