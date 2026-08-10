import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EventosPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Eventos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Calendário de eventos e encontros da comunidade.
      </p>

      <Card className="mt-6">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Calendar className="size-10 text-muted-foreground" />
          <p className="font-medium">Em breve</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Essa área vai reunir os próximos eventos da Helloow Creators.
            Estamos preparando!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
