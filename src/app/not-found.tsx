import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">This Byroo page does not exist.</p>
      <Link href="/" className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">
        Go home
      </Link>
    </main>
  );
}
