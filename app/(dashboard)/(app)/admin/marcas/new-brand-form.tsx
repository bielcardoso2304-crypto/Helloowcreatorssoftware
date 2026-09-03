"use client";

import { useActionState, useRef, useEffect } from "react";
import { createBrand, type BrandActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: BrandActionState = { error: null };

export function NewBrandForm() {
  const [state, formAction, pending] = useActionState(
    createBrand,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state.error]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <Input name="name" placeholder="Nome da marca" required />
        {state.error && (
          <p className="mt-1 text-sm text-destructive">{state.error}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Cadastrar marca"}
      </Button>
    </form>
  );
}
