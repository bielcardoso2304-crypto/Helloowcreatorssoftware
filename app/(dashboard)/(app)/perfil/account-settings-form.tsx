"use client";

import { useActionState } from "react";
import { updateEmail, updatePassword, type AccountActionState } from "./account-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: AccountActionState = { error: null, success: false };

export function AccountSettingsForm({ currentEmail }: { currentEmail: string }) {
  const [emailState, emailAction, emailPending] = useActionState(
    updateEmail,
    initialState
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePassword,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta e login</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form action={emailAction} className="space-y-2">
          <Label htmlFor="account_email">E-mail de login</Label>
          <Input
            id="account_email"
            name="email"
            type="email"
            required
            defaultValue={currentEmail}
          />
          {emailState.error && (
            <p className="text-sm text-destructive">{emailState.error}</p>
          )}
          {emailState.success && (
            <p className="text-sm text-muted-foreground">
              Enviamos um link de confirmação para o novo e-mail. Ele só
              passa a valer depois que você confirmar por lá.
            </p>
          )}
          <Button type="submit" variant="outline" size="sm" disabled={emailPending}>
            {emailPending ? "Salvando..." : "Salvar novo e-mail"}
          </Button>
        </form>

        <form action={passwordAction} className="space-y-2 border-t pt-6">
          <Label htmlFor="new_password">Nova senha</Label>
          <Input
            id="new_password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <Label htmlFor="confirm_password">Confirmar nova senha</Label>
          <Input
            id="confirm_password"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          {passwordState.error && (
            <p className="text-sm text-destructive">{passwordState.error}</p>
          )}
          {passwordState.success && (
            <p className="text-sm text-muted-foreground">
              Senha atualizada com sucesso.
            </p>
          )}
          <Button type="submit" variant="outline" size="sm" disabled={passwordPending}>
            {passwordPending ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
