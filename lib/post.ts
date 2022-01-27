import type { JsonObject } from 'type-fest';
import { join as pathJoin } from 'path';
import { types } from 'util';
import { readdir, readFile } from 'fs/promises';
import matter, { GrayMatterFile, Input } from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';


export interface Post extends JsonObject {
  slug: string;
  title: string;
  date: number; // seconds since unix epoch
  content: string;
}

// This simple implementation only supports posts as `.md` files at the top level of the directory

const postsDirectory = pathJoin(process.cwd(), '_posts');

const markdownProcessor = remark().use(html);

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function slugToFilename(slug: string): string {
  return `${slug}.md`;
}

async function fileToPost(file: GrayMatterFile<Input>, slug: string): Promise<Post> {
  if (typeof file.data.title !== 'string' || !types.isDate(file.data.date)) {
    throw new Error('Invalid post');
  }
  const renderedContent = await markdownProcessor.process(file.content);
  return {
    slug,
    title: file.data.title,
    date: Math.floor(file.data.date.getTime() / 1000),
    content: renderedContent.toString(),
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const filenames = await readdir(postsDirectory);
  return filenames.map(filenameToSlug);
}

export async function getAllPosts(): Promise<Post[]> {
  const filenames = await readdir(postsDirectory);

  const postPromises = filenames.map(async (filename) => {
    const fullFilename = pathJoin(postsDirectory, filename);
    const slug = filenameToSlug(filename);
    const contents = await readFile(fullFilename, 'utf8');
    const markdown = matter(contents);
    return fileToPost(markdown, slug);
  });

  // Files that don't contain a valid post (such as a draft) are represented by a promise that rejects. Those are
  // filtered out so that only valid posts are returned from this function.
  return (await Promise.allSettled(postPromises))
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<Post>).value);
}

export async function getPost(slug: string): Promise<Post> {
  const fullFilename = pathJoin(postsDirectory, slugToFilename(slug));
  const contents = await readFile(fullFilename, 'utf8');
  const markdown = matter(contents);
  return fileToPost(markdown, slug);
}
