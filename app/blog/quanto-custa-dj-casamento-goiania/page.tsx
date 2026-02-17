import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quanto Custa um DJ para Casamento em Goiânia? | Preços 2026',
  description: 'Descubra quanto custa contratar um DJ para casamento em Goiânia. Preços variam de R$ 800 a R$ 3.000+ dependendo do pacote. Veja o que está incluso e como escolher.',
};

export default function BlogPost() {
  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/blog" className="text-zinc-400 hover:text-white mb-8 inline-block transition-colors">
        ← Voltar para o Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
          <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">Orçamento</span>
          <span>•</span>
          <span>17 de Fevereiro, 2026</span>
          <span>•</span>
          <span>5 min de leitura</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Quanto Custa um DJ para Casamento em Goiânia? (Guia 2026)
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Descubra os preços médios, o que está incluso nos pacotes e como escolher o melhor custo-benefício para seu evento.
        </p>
      </header>

      <div className="prose prose-invert prose-lg max-w-none">
        <h2>Resumo Rápido</h2>
        <div className="overflow-x-auto my-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="py-4 px-2 font-semibold text-white">Pacote</th>
                <th className="py-4 px-2 font-semibold text-white">Preço Médio</th>
                <th className="py-4 px-2 font-semibold text-white">Inclui</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="py-4 px-2">Básico</td>
                <td className="py-4 px-2">R$ 800 - R$ 1.200</td>
                <td className="py-4 px-2 text-zinc-400">DJ + Som para cerimônia OU festa</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-4 px-2">Intermediário</td>
                <td className="py-4 px-2">R$ 1.500 - R$ 2.200</td>
                <td className="py-4 px-2 text-zinc-400">DJ + Som completo + Iluminação básica</td>
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="py-4 px-2">Completo</td>
                <td className="py-4 px-2">R$ 2.500 - R$ 3.500+</td>
                <td className="py-4 px-2 text-zinc-400">DJ + Som + Iluminação cênica + Painel LED + Efeitos especiais</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Introdução</h2>
        <p>
          Planejar o casamento dos sonhos envolve muitas decisões, e a música é uma das mais importantes. Afinal, é a trilha sonora que vai marcar os momentos mais emocionantes do seu grande dia: a entrada na cerimônia, a primeira dança, a festa com os convidados.
        </p>
        <p>
          Mas a pergunta que todo noivo faz é: <strong>quanto custa um DJ para casamento em Goiânia?</strong>
        </p>
        <p>
          Neste guia, vamos detalhar os preços praticados no mercado goiano, o que influencia os valores, e como escolher o melhor profissional para o seu casamento.
        </p>

        <h2>Fatores que Influenciam o Preço</h2>
        
        <h3>1. Duração do Evento</h3>
        <p>
          A maioria dos DJs cobra por hora ou por evento completo. Casamentos em Goiânia geralmente duram entre 6 e 10 horas (contando cerimônia e festa).
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-400">
          <li><strong>Cerimônia apenas:</strong> 1-2 horas</li>
          <li><strong>Festa apenas:</strong> 4-6 horas</li>
          <li><strong>Pacote completo (cerimônia + festa):</strong> 6-10 horas</li>
        </ul>

        <h3>2. Qualidade do Equipamento</h3>
        <p>
          O preço varia muito conforme o padrão do equipamento:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-400">
          <li><strong>Equipamento básico:</strong> Caixas de som simples, sem iluminação</li>
          <li><strong>Equipamento intermediário:</strong> Som de qualidade, iluminação básica</li>
          <li><strong>Equipamento premium:</strong> Som profissional, iluminação cênica, painéis LED, máquinas de fumaça, efeitos especiais</li>
        </ul>

        <h3>3. Localização do Casamento</h3>
        <p>
          Casamentos em Goiânia costumam ter preços padrão. Casamentos em cidades vizinhas (Aparecida de Goiânia, Trindade, Anápolis) podem ter acréscimo de deslocamento. Casamentos em fazendas ou locais mais distantes também podem ter custo adicional de logística.
        </p>

        <h3>4. Época do Ano</h3>
        <p>
          A alta temporada de casamentos em Goiânia é de <strong>março a junho</strong> (outono) e <strong>agosto a dezembro</strong> (primavera/verão). Nesses períodos, a demanda é maior e alguns profissionais podem praticar preços mais altos.
        </p>

        <h2>O Que Está Incluso no Preço?</h2>
        <p>Ao contratar um DJ para casamento, verifique o que está incluso:</p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-green-900/30">
            <h3 className="text-green-400 text-lg font-bold mt-0 mb-4">✅ Deve estar incluso:</h3>
            <ul className="list-none pl-0 space-y-2 text-zinc-300">
              <li>• DJ profissional durante todo o evento</li>
              <li>• Equipamento de som (caixas, microfones, mesa)</li>
              <li>• Repertório personalizado</li>
              <li>• Montagem e desmontagem</li>
            </ul>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-yellow-900/30">
            <h3 className="text-yellow-400 text-lg font-bold mt-0 mb-4">⚠️ Pode ser cobrado à parte:</h3>
            <ul className="list-none pl-0 space-y-2 text-zinc-300">
              <li>• Iluminação cênica</li>
              <li>• Painel de LED</li>
              <li>• Máquina de fumaça/bolhas</li>
              <li>• Equipamento extra para cerimônia</li>
              <li>• Horas adicionais</li>
            </ul>
          </div>
        </div>

        <h2>Faixa de Preços por Tipo de Serviço</h2>

        <div className="space-y-6 my-8">
          <div className="border border-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mt-0">🎵 Som para Cerimônia</h3>
            <div className="text-2xl font-bold text-blue-400 my-2">R$ 600 a R$ 1.200</div>
            <p className="text-zinc-400 mb-0">Microfones, música ambiente, entrada da noiva.</p>
          </div>

          <div className="border border-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mt-0">🎧 DJ para Festa</h3>
            <div className="text-2xl font-bold text-blue-400 my-2">R$ 1.000 a R$ 2.500+</div>
            <p className="text-zinc-400 mb-0">DJ, som, iluminação básica, 4-6 horas de festa.</p>
          </div>

          <div className="border border-zinc-800 p-6 rounded-lg bg-blue-900/10 border-blue-500/30">
            <h3 className="text-xl font-bold text-white mt-0">💎 Pacote Completo</h3>
            <div className="text-2xl font-bold text-blue-400 my-2">R$ 2.000 a R$ 4.000+</div>
            <p className="text-zinc-400 mb-0">Cerimônia + Festa + Iluminação completa + Painel LED.</p>
          </div>
        </div>

        <h2>Cuidados ao Contratar um DJ</h2>
        <p><strong>Perguntas Importantes:</strong></p>
        <ol className="list-decimal pl-6 space-y-2 text-zinc-400">
          <li><strong>O DJ tem experiência em casamentos?</strong> Casamentos são diferentes de festas comuns.</li>
          <li><strong>O equipamento é do DJ ou alugado?</strong> DJs com equipamento próprio tendem a ter maior controle sobre a qualidade.</li>
          <li><strong>Há reunião prévia para alinhar o repertório?</strong> É fundamental que o DJ entenda o estilo do casal.</li>
          <li><strong>O contrato especifica tudo que está incluso?</strong> Evite surpresas no dia do evento.</li>
          <li><strong>Há backup em caso de imprevistos?</strong> Profissionais sérios têm planos de contingência.</li>
        </ol>

        <h2>Sobre a Amplify Eventos</h2>
        <p>
          A <strong>Amplify Eventos</strong> é especializada em som e iluminação para casamentos em Goiânia e região. Oferecemos pacotes personalizados para cada tipo de cerimônia e festa.
        </p>
        <p>
          <strong>Nossos diferenciais:</strong> DJ exclusivo, equipamentos de alta qualidade, iluminação cênica profissional e atendimento personalizado.
        </p>

        <div className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl p-8 text-center my-12 not-prose">
          <h3 className="text-2xl font-bold text-white mb-4">Solicite seu Orçamento Personalizado</h3>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Cada casamento é único. Entre em contato via WhatsApp e receba uma proposta em até 24 horas.
          </p>
          <a 
            href="https://wa.me/5562999999999?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20para%20DJ%20de%20casamento" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-900 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors"
          >
            Solicitar Orçamento via WhatsApp →
          </a>
        </div>
      </div>
    </article>
  );
}
