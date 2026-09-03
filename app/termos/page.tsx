import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Termos de Uso — Helloow Creators" };

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Termos de Uso</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>

      <div className="prose prose-sm mt-8 flex max-w-none flex-col gap-6 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="mb-2 font-semibold">1. Sobre a plataforma</h2>
          <p>
            A Helloow Creators é uma plataforma que conecta criadores de
            conteúdo e marcas interessadas em desenvolver parcerias de
            conteúdo na internet. Ao criar uma conta, você concorda com estes
            Termos de Uso e com a nossa{" "}
            <Link href="/privacidade" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Cadastro</h2>
          <p>
            Ao se cadastrar, você escolhe se está criando uma conta de
            criador de conteúdo ou de marca, e informa dados verdadeiros,
            completos e atualizados. Você é responsável por manter sua senha
            em sigilo e por tudo o que acontecer na sua conta.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Visibilidade do perfil</h2>
          <p>
            As informações do seu perfil (nome, foto, biografia, redes
            sociais, cidade/estado, e — no caso de marcas — segmento e site)
            ficam visíveis para os demais membros logados da plataforma, para
            possibilitar conexões entre criadores e marcas. Dados de contato
            direto como e-mail e WhatsApp não são exibidos publicamente para
            outros membros — apenas para a administração da Helloow
            Creators.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Negócios intermediados</h2>
          <p>
            Negócios fechados entre criadores e marcas por meio da Helloow
            Creators podem ser registrados internamente pela administração,
            incluindo valores acordados, para fins de controle financeiro e
            comercial da empresa. Esses registros são mantidos mesmo que uma
            das contas envolvidas seja posteriormente excluída, já que
            representam operações comerciais já realizadas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Conduta</h2>
          <p>
            Não é permitido usar a plataforma para fins ilícitos, enviar
            informações falsas, se passar por outra pessoa ou empresa, ou
            violar direitos de terceiros. A Helloow Creators pode suspender
            ou excluir contas que violem estes termos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">6. Exclusão de conta</h2>
          <p>
            Você pode excluir sua conta a qualquer momento na tela "Meu
            perfil". A exclusão remove permanentemente seu perfil, dados de
            contato e conexões da plataforma, conforme detalhado na nossa{" "}
            <Link href="/privacidade" className="underline underline-offset-4">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">7. Alterações</h2>
          <p>
            Podemos atualizar estes termos ao longo do tempo. Alterações
            relevantes serão comunicadas pelos canais da plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">8. Contato</h2>
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{" "}
            <a
              href="mailto:helloowcreators@gmail.com"
              className="underline underline-offset-4"
            >
              helloowcreators@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
