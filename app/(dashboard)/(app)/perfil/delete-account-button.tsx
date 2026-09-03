"use client";

import { Button } from "@/components/ui/button";
import { deleteMyAccount } from "./delete-account-actions";

export function DeleteAccountButton() {
  return (
    <form
      action={deleteMyAccount}
      onSubmit={(e) => {
        if (
          !confirm(
            "Excluir sua conta? Seu perfil, dados de contato e conexões serão apagados permanentemente. Essa ação não pode ser desfeita."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        Excluir minha conta
      </Button>
    </form>
  );
}
