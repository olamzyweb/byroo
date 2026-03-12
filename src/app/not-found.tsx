import { ButtonLink, Card } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-5 py-8">
      <Card className="w-full text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">This Byroo page does not exist or is not published yet.</p>
        <ButtonLink href="/" className="mt-5">
          Go home
        </ButtonLink>
      </Card>
    </main>
  );
}
