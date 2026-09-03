"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type SignupActionState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: SignupActionState = { error: null, success: false };

export function SignupForm({ isBrand }: { isBrand: boolean }) {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          {isBrand
            ? "Cadastre sua marca na Helloow Creators."
            : "Cadastre-se como criador filiado à Helloow Creators."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <p className="text-sm text-muted-foreground">
            Conta criada! Confira seu e-mail (e a pasta de spam) e clique no
            link de confirmação antes de entrar.
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input
              type="hidden"
              name="account_type"
              value={isBrand ? "brand" : "creator"}
            />
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="accepted_terms"
                required
                className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
              />
              <span>
                Li e aceito os{" "}
                <Link
                  href="/termos"
                  target="_blank"
                  className="text-foreground underline underline-offset-4"
                >
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link
                  href="/privacidade"
                  target="_blank"
                  className="text-foreground underline underline-offset-4"
                >
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
