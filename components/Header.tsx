import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-gray-800 mb-6">
      <header className="max-w-screen-lg mx-auto py-6 px-4">
        <h1 className="text-white font-banner text-4xl">
          <Link href="/">Ankur Oberoi</Link>
        </h1>
      </header>
    </div>
  )
}
