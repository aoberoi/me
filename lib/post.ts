import type { JsonObject, RequireAtLeastOne } from 'type-fest';
import { join as pathJoin } from 'path';
import { types } from 'util';
import { readdir, readFile } from 'fs/promises';
import matter, { GrayMatterFile, Input } from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

export enum PostStatus {
  /** Visible on the site */
  Published = 'published',
  /** Hidden on the site */
  Draft = 'draft',
}

// Using several interfaces here to model the requirement that a published post requires a date, while other variations
// of a post leaves date as optional.

interface _PostBase extends JsonObject {
  /** The last path component of the URL for this post. The slug is a unique identifier for the post. */
  slug: string;
  title: string;
  status: PostStatus;
  /** Seconds since the unix epoch */
  date?: number;
  /** HTML content of the post */
  content: string;
}

export interface PublishedPost extends _PostBase {
  status: PostStatus.Published;
  date: number;
}

export type Post = PublishedPost | _PostBase;

// This simple implementation only supports posts as `.md` files at the top level of the directory

// There's several places where data is created by reading from the filesystem, and then recreated later by reading
// again. We could improve performance by caching some of the data that's read in memory and reusing it. Not sure what
// the hit rate of that cache might be if the next build is parallelized across many processes that cannot share the
// cache.

const postsDirectory = pathJoin(process.cwd(), '_posts');

const markdownProcessor = remark().use(html);

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function slugToFilename(slug: string): string {
  return `${slug}.md`;
}

async function fileToPost(file: GrayMatterFile<Input>, slug: string): Promise<Post> {
  if (typeof file.data.title !== 'string') {
    throw new Error('Invalid post');
  }

  const renderedContent = await markdownProcessor.process(file.content);
  const date = file.data.date;

  if (types.isDate(date)) {
    return {
      slug,
      title: file.data.title,
      status: PostStatus.Published,
      date: Math.floor(date.getTime() / 1000),
      content: renderedContent.toString(),
    };
  }

  return {
    slug,
    title: file.data.title,
    status: PostStatus.Draft,
    content: renderedContent.toString(),
  };
}

function isPublished(post: Post): post is PublishedPost {
  return post.status === PostStatus.Published;
}

export async function getAllSlugs(): Promise<string[]> {
  const filenames = await readdir(postsDirectory);
  return filenames.map(filenameToSlug);
}

/**
 * Retrieve the most recent `n` number of published posts.
 *
 * NOTE: Current callers of this function are only interested in the post metadata for listings. There a potential
 * performance optimization available by skipping the markdown processing for the file contents.
 *
 * NOTE: This might be better modeled as a streaming operation, to support future streaming SSR. In this case, instead
 * of `n` being a parameter, the entire stream could be subscribed and the caller could just take n from the stream and
 * close it.
 *
 * @param n number of posts
 */
export async function getRecentPosts(n = Infinity): Promise<PublishedPost[]> {
  const filenames = await readdir(postsDirectory);
  const postPromises = filenames.map((filename) => getPostFromLocation({ filename }));

  const posts = (await Promise.allSettled(postPromises))
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<Post>).value);
  const publishedPosts = posts.filter(isPublished);
  const sortedPosts = publishedPosts.sort((a, b) => b.date - a.date);

  return sortedPosts.slice(0, n - 1);
}

export type PostLocation = RequireAtLeastOne<{
  filename?: string;
  slug?: string;
}, 'filename' | 'slug'>

export async function getPostFromLocation(location: PostLocation): Promise<Post> {
  // Ideally, the PostLocation type would support narrowing, but it does not.
  // https://github.com/sindresorhus/type-fest/issues/230
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const filename = location.filename ?? slugToFilename(location.slug!);
  const slug = location.slug ?? filenameToSlug(filename);

  const fullFilename = pathJoin(postsDirectory, filename);
  const contents = await readFile(fullFilename, 'utf8');

  const vFile = matter(contents);
  return fileToPost(vFile, slug);
}
