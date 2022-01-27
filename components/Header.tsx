import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-zinc-800 mb-6">
      <header className="max-w-screen-lg mx-auto px-4 py-6">
        <h1 className="text-white font-banner text-4xl">
          <Link href="/">Ankur Oberoi</Link>
        </h1>
      </header>
    </div>
  )
}
