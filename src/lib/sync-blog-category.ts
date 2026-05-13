import { inferBlogTopicSlug } from "@/lib/blog-topic";
import { prisma } from "@/lib/prisma";

/**
 * Replace blog↔topic links with one category row matching title/excerpt heuristic.
 * No-op when the inferred slug has no Category row (run seed or Medium import upserts).
 */
export async function assignInferredBlogTopic(
  blogId: string,
  title: string,
  excerpt: string,
  bodyPlainSnippet = "",
) {
  const topicSlug = inferBlogTopicSlug(title, excerpt, bodyPlainSnippet);
  await prisma.blogOnCategory.deleteMany({ where: { blogId } });
  const category = await prisma.category.findUnique({
    where: { slug: topicSlug },
  });
  if (category) {
    await prisma.blogOnCategory.create({
      data: { blogId, categoryId: category.id },
    });
  }
}
