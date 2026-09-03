"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthActionState } from "../actions";
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

const initialState: AuthActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta na Helloow Creators.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/esqueci-senha"
                className="text-xs text-muted-foreground underline underline-offset-4"
              >
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-4 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <span>Não tem conta?</span>
          <div className="flex w-full gap-2">
            <Link
              href="/signup?tipo=criador"
              className="flex-1 rounded-lg border px-3 py-2 text-center font-medium text-foreground transition-colors hover:bg-muted"
            >
              Sou criador
            </Link>
            <Link
              href="/signup?tipo=marca"
              className="flex-1 rounded-lg border px-3 py-2 text-center font-medium text-foreground transition-colors hover:bg-muted"
            >
              Sou marca
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
