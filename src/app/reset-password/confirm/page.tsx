import { BrandLogo } from "@/components/brand-logo";
import { Card } from "@/components/ui";

export default async function ConfirmResetPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-10">
      <Card className="w-full text-center">
        <BrandLogo />
        <h1 className="mt-4 text-2xl font-semibold">Verify your reset link</h1>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Please click the button below to confirm your request and update your password.
        </p>

        {code ? (
          <form action="/api/auth/callback" method="GET" className="mt-6">
            {/* Pass the code and the destination target */}
            <input type="hidden" name="code" value={code} />
            <input type="hidden" name="next" value="/reset-password/update" />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition cursor-pointer"
            >
              Confirm and Continue
            </button>
          </form>
        ) : (
          <div className="mt-6 text-sm text-red-500 font-semibold">
            Invalid reset parameters. Please trigger a new link.
          </div>
        )}
      </Card>
    </main>
  );
}
