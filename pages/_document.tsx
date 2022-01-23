import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="icon" href="/favicon.ico" />
          {/* TODO: use webpack image loader to generate cache busting filenames (in the manifest file too) */}
          {/* TODO: update the icon with a transparent background */}
          <link rel="icon" href="/icon.v1.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.v1.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
