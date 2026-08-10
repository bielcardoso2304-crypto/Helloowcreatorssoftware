"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";
import type { Creator } from "@/lib/get-current-creator";

export type CreatorProfileActionState = { error: string | null };

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "other", label: "Outra" },
] as const;

const contactMethods = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "E-mail" },
  { value: "instagram", label: "Instagram" },
] as const;

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const steps = [
  "Dados pessoais",
  "Contato",
  "Sobre você",
  "Instagram",
  "TikTok",
  "YouTube",
  "Mais informações",
] as const;

export function CreatorProfileForm({
  action,
  defaultValues,
  submitLabel,
  pendingLabel,
}: {
  action: (
    state: CreatorProfileActionState,
    formData: FormData
  ) => Promise<CreatorProfileActionState>;
  defaultValues?: Partial<Creator> & { email?: string };
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    CreatorProfileActionState,
    FormData
  >(action, { error: null });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    defaultValues?.avatar_url ?? null
  );
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const isLastStep = step === steps.length - 1;

  function goToStep(target: number) {
    // Validate every field on the *current* step before leaving it — native
    // constraint validation skips hidden fields, so without this a required
    // field on an earlier step could otherwise be silently skipped.
    const container = formRef.current?.querySelector(`[data-step="${step}"]`);
    if (container) {
      for (const el of container.querySelectorAll("input, select, textarea")) {
        const field = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (!field.checkValidity()) {
          field.reportValidity();
          return;
        }
      }
    }
    setStep(target);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{steps[step]}</span>
            <span className="text-muted-foreground">
              Etapa {step + 1} de {steps.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <form ref={formRef} action={formAction} className="space-y-6">
          <div data-step={0} className={cn("space-y-4", step !== 0 && "hidden")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={defaultValues?.full_name ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage_name">Nome artístico (opcional)</Label>
                <Input
                  id="stage_name"
                  name="stage_name"
                  defaultValue={defaultValues?.stage_name ?? ""}
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
                <Label htmlFor="birth_date">Data de nascimento</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  required
                  defaultValue={defaultValues?.birth_date ?? ""}
                />
              </div>
            </div>
          </div>

          <div data-step={1} className={cn("space-y-4", step !== 1 && "hidden")}>
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
            <div className="space-y-2">
              <Label htmlFor="city_state">Cidade e estado</Label>
              <Input
                id="city_state"
                name="city_state"
                required
                placeholder="Ex: São Paulo, SP"
                defaultValue={defaultValues?.city_state ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_contact">
                Forma de contato preferida (opcional)
              </Label>
              <select
                id="preferred_contact"
                name="preferred_contact"
                defaultValue={defaultValues?.preferred_contact ?? ""}
                className={selectClassName}
              >
                <option value="">Sem preferência</option>
                {contactMethods.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div data-step={2} className={cn("space-y-4", step !== 2 && "hidden")}>
            <div className="flex items-center gap-4">
              <Avatar src={avatarPreview} size="size-16" />
              <div className="space-y-2">
                <Label htmlFor="avatar">Foto de perfil (opcional)</Label>
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
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia (opcional)</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Conte um pouco sobre você e seu trabalho"
                defaultValue={defaultValues?.bio ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche">Nicho de conteúdo (opcional)</Label>
              <Textarea
                id="niche"
                name="niche"
                placeholder="Ex: moda, humor, tecnologia, maternidade..."
                defaultValue={defaultValues?.niche ?? ""}
              />
            </div>
          </div>

          <div data-step={3} className={cn("space-y-4", step !== 3 && "hidden")}>
            <p className="text-sm text-muted-foreground">
              Tudo aqui é opcional — preencha se você usa essa rede.
            </p>
            <div className="space-y-2">
              <Label htmlFor="instagram_handle">Instagram (@)</Label>
              <Input
                id="instagram_handle"
                name="instagram_handle"
                placeholder="@seuusuario"
                defaultValue={defaultValues?.instagram_handle ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Link do Instagram</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                placeholder="https://instagram.com/seuusuario"
                defaultValue={defaultValues?.instagram_url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_followers">Seguidores</Label>
              <Input
                id="instagram_followers"
                name="instagram_followers"
                type="number"
                min={0}
                defaultValue={defaultValues?.instagram_followers ?? ""}
              />
            </div>
          </div>

          <div data-step={4} className={cn("space-y-4", step !== 4 && "hidden")}>
            <p className="text-sm text-muted-foreground">
              Tudo aqui é opcional — preencha se você usa essa rede.
            </p>
            <div className="space-y-2">
              <Label htmlFor="tiktok_handle">TikTok (@)</Label>
              <Input
                id="tiktok_handle"
                name="tiktok_handle"
                placeholder="@seuusuario"
                defaultValue={defaultValues?.tiktok_handle ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_url">Link do TikTok</Label>
              <Input
                id="tiktok_url"
                name="tiktok_url"
                placeholder="https://tiktok.com/@seuusuario"
                defaultValue={defaultValues?.tiktok_url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_followers">Seguidores</Label>
              <Input
                id="tiktok_followers"
                name="tiktok_followers"
                type="number"
                min={0}
                defaultValue={defaultValues?.tiktok_followers ?? ""}
              />
            </div>
          </div>

          <div data-step={5} className={cn("space-y-4", step !== 5 && "hidden")}>
            <p className="text-sm text-muted-foreground">
              Tudo aqui é opcional — preencha se você usa essa rede.
            </p>
            <div className="space-y-2">
              <Label htmlFor="youtube_handle">YouTube (canal)</Label>
              <Input
                id="youtube_handle"
                name="youtube_handle"
                placeholder="Nome do canal"
                defaultValue={defaultValues?.youtube_handle ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">Link do YouTube</Label>
              <Input
                id="youtube_url"
                name="youtube_url"
                placeholder="https://youtube.com/@seucanal"
                defaultValue={defaultValues?.youtube_url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_followers">Inscritos</Label>
              <Input
                id="youtube_followers"
                name="youtube_followers"
                type="number"
                min={0}
                defaultValue={defaultValues?.youtube_followers ?? ""}
              />
            </div>
          </div>

          <div data-step={6} className={cn("space-y-4", step !== 6 && "hidden")}>
            <div className="space-y-2">
              <Label htmlFor="main_platform">Plataforma principal</Label>
              <select
                id="main_platform"
                name="main_platform"
                required
                defaultValue={defaultValues?.main_platform ?? ""}
                className={selectClassName}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {platforms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="other_platform_name">
                  Outra plataforma (opcional)
                </Label>
                <Input
                  id="other_platform_name"
                  name="other_platform_name"
                  placeholder="Ex: Kwai, Twitch..."
                  defaultValue={defaultValues?.other_platform_name ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_url">Link</Label>
                <Input
                  id="other_url"
                  name="other_url"
                  placeholder="https://..."
                  defaultValue={defaultValues?.other_url ?? ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commercial_info">
                Informações comerciais (opcional)
              </Label>
              <Textarea
                id="commercial_info"
                name="commercial_info"
                placeholder="Ex: valores de publi, formatos que você faz, disponibilidade para parcerias..."
                defaultValue={defaultValues?.commercial_info ?? ""}
              />
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="flex gap-2">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                Voltar
              </Button>
            )}
            {!isLastStep && (
              <Button
                type="button"
                className="flex-1"
                onClick={() => goToStep(step + 1)}
              >
                Avançar
              </Button>
            )}
            {isLastStep && (
              <Button type="submit" className="flex-1" disabled={pending}>
                {pending ? pendingLabel : submitLabel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
