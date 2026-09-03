import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Política de Privacidade — Helloow Creators" };

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">
        Política de Privacidade
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>

      <div className="prose prose-sm mt-8 flex max-w-none flex-col gap-6 text-sm leading-relaxed text-foreground">
        <section>
          <p>
            Esta política explica quais dados a Helloow Creators coleta,
            para que eles são usados, e quais direitos você tem sobre eles,
            em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei
            nº 13.709/2018).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">1. Dados que coletamos</h2>
          <p>Dependendo do tipo de conta, coletamos:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Criadores:</strong> nome completo, nome artístico,
              e-mail, data de nascimento, WhatsApp, cidade/estado,
              biografia, nicho de conteúdo, redes sociais e número de
              seguidores, forma de contato preferida e informações
              comerciais.
            </li>
            <li>
              <strong>Marcas:</strong> nome da empresa, nome do contato,
              e-mail, WhatsApp, cidade/estado, segmento de atuação,
              biografia, site e Instagram.
            </li>
            <li>
              <strong>Todos:</strong> foto de perfil (opcional) e dados
              técnicos de login administrados pelo Supabase (provedor de
              autenticação).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Para que usamos esses dados</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Criar e manter sua conta na plataforma;</li>
            <li>
              Exibir seu perfil para outros membros, permitindo conexões
              entre criadores e marcas;
            </li>
            <li>
              Registrar negócios intermediados pela Helloow Creators e seus
              respectivos valores, para controle financeiro da empresa;
            </li>
            <li>Comunicar novidades, eventos e avisos importantes;</li>
            <li>Cumprir obrigações legais, quando aplicável.</li>
          </ul>
          <p className="mt-2">
            A base legal para esse tratamento é o seu consentimento,
            fornecido no momento do cadastro (art. 7º, I, da LGPD).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Com quem compartilhamos</h2>
          <p>
            As informações públicas do seu perfil ficam visíveis para outros
            membros logados na plataforma. Não vendemos nem compartilhamos
            seus dados com terceiros para fins de marketing. Seus dados
            ficam hospedados no Supabase, nosso provedor de banco de dados e
            autenticação.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Seus direitos</h2>
          <p>Conforme o art. 18 da LGPD, você pode a qualquer momento:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Confirmar e acessar os dados que temos sobre você;</li>
            <li>Corrigir dados desatualizados ou incorretos — direto na tela "Meu perfil";</li>
            <li>
              Solicitar a exclusão dos seus dados — você mesmo pode excluir
              sua conta a qualquer momento na tela "Meu perfil", ou pedir
              pelo nosso contato;
            </li>
            <li>Revogar seu consentimento a qualquer momento.</li>
          </ul>
          <p className="mt-2">
            Ao excluir sua conta, removemos permanentemente seu perfil,
            dados de contato e conexões. A única exceção são registros de
            negócios já fechados através da plataforma (valores e datas),
            que são mantidos por interesse legítimo da empresa em preservar
            seu histórico financeiro — sem, no entanto, manter seus dados de
            contato vinculados a eles.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Segurança</h2>
          <p>
            Usamos autenticação e controle de acesso do Supabase, com regras
            de segurança em nível de banco de dados (Row Level Security)
            que garantem que cada pessoa só acesse os dados que tem
            permissão para ver. Senhas nunca são armazenadas em texto puro.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">6. Contato</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas sobre esta política,
            fale com a gente em{" "}
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
