import type { ParsedUrlQuery } from 'querystring';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { getAllSlugs, getPostFromLocation, Post } from '../../lib/post';
import Layout from '../../components/Layout';

interface PostProps {
  post: Post;
}

interface PostUrlQuery extends ParsedUrlQuery {
  slug: string;
}

export default function PostPage({ post }: PostProps) {
  return (
    <Layout title={post.title}>
      <section className="max-w-screen-lg mx-auto px-4">
        <h2 className="text-2xl font-banner my-2">{post.title}</h2>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }}/>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<PostProps, PostUrlQuery> = async (context) => {
  const slug = context.params?.slug;
  if (slug === undefined) {
    return {
      notFound: true,
    };
  }

  try {
    return {
      props: {
        post: await getPostFromLocation({ slug }),
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths<PostUrlQuery> = async () => {
  const slugs = await getAllSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};
