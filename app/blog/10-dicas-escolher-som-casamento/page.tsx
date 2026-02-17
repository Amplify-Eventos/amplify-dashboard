import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10 Dicas para Escolher o Som do Seu Casamento | Guia Completo',
  description: 'Aprenda a escolher a melhor sonorização para seu casamento em Goiânia. Equipamentos, DJ, iluminação e tudo que você precisa saber para uma festa perfeita.',
};

export default function BlogPost() {
  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blog" className="text-zinc-400 hover:text-white mb-8 inline-block transition-colors">
        ← Voltar para o Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
          <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">Planejamento</span>
          <span>•</span>
          <span>17 de Fevereiro, 2026</span>
          <span>•</span>
          <span>7 min de leitura</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          10 Dicas para Escolher o Som do Seu Casamento em Goiânia
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Um guia completo para garantir a melhor sonorização, iluminação e DJ para sua festa ser inesquecível.
        </p>
      </header>

      <div className="prose prose-invert prose-lg max-w-none">
        <h2>Introdução</h2>
        <p>
          A música é a alma de qualquer festa de casamento. Ela cria momentos mágicos, faz os convidados dançarem e eterniza memórias. Mas como garantir que você está escolhendo o som certo para o seu grande dia?
        </p>
        <p>
          Preparamos 10 dicas essenciais para ajudar noivos a tomar a melhor decisão na hora de contratar a sonorização do casamento.
        </p>

        <div className="space-y-12 my-12">
          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Defina o Estilo da Sua Festa
            </h3>
            <p className="text-zinc-400 mt-4">
              Antes de contratar qualquer serviço, converse com seu parceiro sobre o estilo da festa:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 mt-4 list-none pl-0">
              <li className="bg-zinc-900 p-4 rounded border border-zinc-800">
                <strong className="text-blue-400 block mb-1">Festa Tradicional</strong>
                Valsas, MPB, músicas clássicas
              </li>
              <li className="bg-zinc-900 p-4 rounded border border-zinc-800">
                <strong className="text-blue-400 block mb-1">Festa Moderna</strong>
                Eletrônica, Pop, Remixes
              </li>
              <li className="bg-zinc-900 p-4 rounded border border-zinc-800">
                <strong className="text-blue-400 block mb-1">Temática</strong>
                Sertanejo, Rock, Anos 80
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Cerimônia e Festa: Sonorização Diferente
            </h3>
            <p className="text-zinc-400 mt-4">
              Muitos noivos esquecem que a cerimônia precisa de equipamentos diferentes da festa.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-bold text-white mb-2">Cerimônia</h4>
                <ul className="list-disc pl-5 text-zinc-400 space-y-1">
                  <li>Microfones discretos</li>
                  <li>Som ambiente suave</li>
                  <li>Microfones sem fio para leituras</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Festa</h4>
                <ul className="list-disc pl-5 text-zinc-400 space-y-1">
                  <li>Som potente (graves)</li>
                  <li>Iluminação integrada</li>
                  <li>DJ com repertório animado</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Avalie a Qualidade do Equipamento
            </h3>
            <p className="text-zinc-400 mt-4">
              Pergunte sobre marcas, potência e estado de conservação. <strong>Red Flag:</strong> Valores muito abaixo do mercado podem indicar equipamentos velhos ou de má qualidade.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Conheça o DJ
            </h3>
            <p className="text-zinc-400 mt-4">
              Um bom DJ de balada não é necessariamente um bom DJ de casamento. Casamentos exigem sensibilidade, pontualidade e leitura de pista para diferentes idades.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Não Esqueça da Iluminação
            </h3>
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="py-2 px-2 font-semibold text-white">Tipo</th>
                    <th className="py-2 px-2 font-semibold text-white">Efeito</th>
                    <th className="py-2 px-2 font-semibold text-white">Recomendado</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-zinc-800">
                    <td className="py-2 px-2">Cênica</td>
                    <td className="py-2 px-2 text-zinc-400">Valoriza a decoração</td>
                    <td className="py-2 px-2 text-zinc-400">Salões, cerimônia</td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-2 px-2">Moving Heads</td>
                    <td className="py-2 px-2 text-zinc-400">Luzes em movimento</td>
                    <td className="py-2 px-2 text-zinc-400">Pista de dança</td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-2 px-2">Painel LED</td>
                    <td className="py-2 px-2 text-zinc-400">Visuais e textos</td>
                    <td className="py-2 px-2 text-zinc-400">Festas modernas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Verifique a Cobertura Geográfica
            </h3>
            <p className="text-zinc-400 mt-4">
              Se vai casar em fazenda ou local aberto, verifique geradores, proteção contra poeira e logística. A Amplify atende Goiânia, Aparecida, Trindade e Anápolis.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Leia Contratos com Atenção
            </h3>
            <p className="text-zinc-400 mt-4">
              Verifique data, horário, lista de equipamentos, nome do DJ, política de cancelamento e cláusula de backup. <strong>Nunca feche negócio apenas verbalmente.</strong>
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
              Planeje o Repertório
            </h3>
            <p className="text-zinc-400 mt-4">
              A reunião de repertório é fundamental. Defina músicas para entrada, valsa e o que <strong>NÃO</strong> deve tocar. Dica: crie uma playlist no Spotify para compartilhar.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
              Considere a Capacidade do Espaço
            </h3>
            <p className="text-zinc-400 mt-4">
              O som deve ser proporcional. Espaço pequeno pede som compacto; espaço grande exige line array. Som muito forte incomoda, som fraco desanima.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
              Contrate com Antecedência
            </h3>
            <p className="text-zinc-400 mt-4">
              Goiânia tem alta demanda, especialmente de março a junho e agosto a dezembro. Bons profissionais fecham agenda 4 a 6 meses antes.
            </p>
          </section>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 my-12">
          <h3 className="text-xl font-bold text-white mb-4">Checklist Rápido para Contratação</h3>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800 text-blue-500" readOnly />
              O fornecedor tem experiência com casamentos?
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800 text-blue-500" readOnly />
              O repertório pode ser personalizado?
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800 text-blue-500" readOnly />
              Os equipamentos são adequados para meu espaço?
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800 text-blue-500" readOnly />
              O contrato é claro e detalhado?
            </li>
          </ul>
        </div>

        <h2>Sobre a Amplify Eventos</h2>
        <p>
          A <strong>Amplify Eventos</strong> é especializada em som e iluminação para casamentos em Goiânia e região. Com anos de experiência, oferecemos DJ exclusivo, equipamentos de alta qualidade e atendimento personalizado.
        </p>

        <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-8 text-center my-12 not-prose">
          <h3 className="text-2xl font-bold text-white mb-4">Solicite seu Orçamento</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Gostou das dicas? O próximo passo é garantir a melhor data para seu evento.
          </p>
          <a 
            href="https://wa.me/5562999999999?text=Ol%C3%A1%2C%20li%20as%20dicas%20no%20blog%20e%20gostaria%20de%20um%20or%C3%A7amento" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-900 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors"
          >
            Falar com a Amplify no WhatsApp →
          </a>
        </div>
      </div>
    </article>
  );
}
