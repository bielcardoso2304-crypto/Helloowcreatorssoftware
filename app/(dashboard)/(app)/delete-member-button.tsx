"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteMember } from "./admin-member-actions";

export function DeleteMemberButton({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  return (
    <form
      action={deleteMember.bind(null, userId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `Excluir a conta de ${name}? Essa ação não pode ser desfeita.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        <Trash2 className="size-4" />
        Excluir usuário
      </Button>
    </form>
  );
}
