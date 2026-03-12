import { addTestimonialAction, deleteTestimonialAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";
import { Badge, Card, EmptyState, HelperText, Input, SectionHeader, TextArea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <SectionHeader title="Reviews" subtitle="Show customer trust proof on your storefront page." />
      {params.error ? <HelperText tone="error">{params.error}</HelperText> : null}
      {params.message ? <HelperText tone="success">{params.message}</HelperText> : null}

      <Card>
        <form action={addTestimonialAction} className="space-y-3">
          <Input name="customerName" placeholder="Customer name" required />
          <TextArea name="reviewText" rows={3} placeholder="What the customer said" required />
          <select name="rating" className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
          <SubmitButton className="w-fit">Add review</SubmitButton>
        </form>
      </Card>

      {(testimonials ?? []).length === 0 ? (
        <EmptyState title="No reviews yet" body="Add customer testimonials to build buyer confidence." />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {(testimonials ?? []).map((review) => (
          <Card key={review.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{review.customer_name}</p>
              <Badge tone="brand">{"★".repeat(review.rating)}</Badge>
            </div>
            <p className="text-sm text-[var(--text-soft)]">{review.review_text}</p>
            <form action={deleteTestimonialAction}>
              <input type="hidden" name="testimonialId" value={review.id} />
              <SubmitButton variant="danger" size="sm">Delete</SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}



