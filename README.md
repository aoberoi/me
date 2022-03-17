# aoberoi.me

My personal website

## Local development

Build and run the development server

```sh
$ npm run dev
```

Build the production site locally

```sh
$ npm run build
```

## Posts

Posts are long form content served under the `/p/{slug}` URL path. There's an index of all posts served at `/posts`.
Post source files are in the `_posts` directory. The `{slug}` portion of the URL is determined by the source file name
in the directory. There's no support for any hierarchical posts (no sub-paths).

Each post source file contains metadata in the frontmatter. The following table describes some important keys.

| Key           | Type           | Required? | Description                                                                                                                                    |
| ------------- | -------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`       | yes       | Post title.                                                                                                                                    |
| `date`        | `"YYYY-MM-DD"` | no        | Post date. Required for the post to be published, otherwise it's a draft.                                                                      |
| `environment` | `string`       | no        | If specified, the post is only visible if `NODE_ENV` matches the value. This is useful for posts that are only meant to appear in development. |

All posts are authored in Markdown (with the GitHub-flavored extensions).

Posts are pre-rendered during the site build. There's currently no need for dynamic content on these pages. The
pre-rendering is implemented using Next.js' `getStaticPaths()` and `getStaticProps()`.
