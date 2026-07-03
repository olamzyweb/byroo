"use client";

import { deleteUserAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/submit-button";

export function DeleteUserForm({ targetUserId, returnTo }: { targetUserId: string; returnTo: string }) {
  return (
    <form
      action={deleteUserAction}
      onSubmit={(e) => {
        if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="targetUserId" value={targetUserId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <SubmitButton size="sm" variant="danger" pendingText="Deleting...">
        Delete user
      </SubmitButton>
    </form>
  );
}
