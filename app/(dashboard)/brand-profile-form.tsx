"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/avatar";
import type { BrandProfile } from "@/lib/get-brand-profile";

export type BrandProfileActionState = { error: string | null };

export function BrandProfileForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
}: {
  action: (
    state: BrandProfileActionState,
    formData: FormData
  ) => Promise<BrandProfileActionState>;
  defaultValues?: Partial<BrandProfile> & { email?: string };
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    BrandProfileActionState,
    FormData
  >(action, { error: null });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    defaultValues?.avatar_url ?? null
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={avatarPreview} size="size-16" />
            <div className="space-y-2">
              <Label htmlFor="avatar">Logo da marca (opcional)</Label>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da marca</Label>
              <Input
                id="company_name"
                name="company_name"
                required
                defaultValue={defaultValues?.company_name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_name">Nome do contato</Label>
              <Input
                id="contact_name"
                name="contact_name"
                required
                defaultValue={defaultValues?.contact_name ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Melhor e-mail para contato</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={defaultValues?.email ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                required
                placeholder="(00) 00000-0000"
                defaultValue={defaultValues?.whatsapp ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="city_state">Cidade e estado</Label>
              <Input
                id="city_state"
                name="city_state"
                required
                placeholder="Ex: São Paulo, SP"
                defaultValue={defaultValues?.city_state ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="segment">Segmento de atuação (opcional)</Label>
              <Input
                id="segment"
                name="segment"
                placeholder="Ex: beleza, moda, alimentação..."
                defaultValue={defaultValues?.segment ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Sobre a marca (opcional)</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Conte um pouco sobre a marca e o que ela procura em criadores"
              defaultValue={defaultValues?.bio ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website_url">Site (opcional)</Label>
              <Input
                id="website_url"
                name="website_url"
                placeholder="https://..."
                defaultValue={defaultValues?.website_url ?? ""}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="instagram_handle">Instagram (opcional)</Label>
              <Input
                id="instagram_handle"
                name="instagram_handle"
                placeholder="@suamarca"
                defaultValue={defaultValues?.instagram_handle ?? ""}
              />
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? pendingLabel : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
