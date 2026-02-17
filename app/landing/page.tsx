import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Som e Iluminação para Casamento em Goiânia | Amplify Eventos',
  description: 'Transforme seu casamento com som de alta qualidade e iluminação cênica. Equipamentos profissionais e DJ experiente em Goiânia. Solicite um orçamento!',
};

export default function LandingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quanto custa um DJ para casamento em Goiânia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O preço de um DJ para casamento em Goiânia varia de R$ 800 a R$ 3.500+, dependendo do pacote escolhido. Pacotes básicos incluem DJ e som simples, enquanto pacotes completos incluem cerimônia, festa, iluminação cênica e painel LED."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês atendem casamentos em Aparecida de Goiânia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, a Amplify Eventos atende Goiânia, Aparecida de Goiânia, Trindade, Anápolis e toda a região metropolitana. O deslocamento está incluso no orçamento para a maioria dos locais."
        }
      },
      {
        "@type": "Question",
        "name": "O som para cerimônia está incluso no pacote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Depende do pacote contratado. Oferecemos pacotes completos (cerimônia + festa) ou serviços separados. A sonorização de cerimônia inclui microfones para o celebrante, música ambiente e som para entrada da noiva."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona a escolha do repertório?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Realizamos uma reunião prévia com os noivos para alinhar todas as músicas importantes: entrada da noiva, primeira dança, músicas que não devem tocar, e estilos preferidos para a festa. Você também pode enviar uma playlist do Spotify com suas preferências."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fornecem iluminação para casamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Oferecemos iluminação cênica para valorizar a decoração, moving heads para pista de dança, painéis LED, bolas espelhadas e efeitos especiais como máquina de fumaça. A iluminação pode ser contratada junto com o som ou separadamente."
        }
      },
      {
        "@type": "Question",
        "name": "Com quanto tempo de antecedência devo contratar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Recomendamos contratar com 4 a 6 meses de antecedência, especialmente se o casamento for na alta temporada (março a junho ou agosto a dezembro). Datas de sábado e feriados costumam ser as mais disputadas."
        }
      },
      {
        "@type": "Question",
        "name": "O DJ trabalha com eventos religiosos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, temos experiência com casamentos em igrejas, cerimônias ao ar livre e eventos religiosos. Sabemos respeitar as características de cada local e trabalhamos com equipamentos adequados para cada tipo de ambiente."
        }
      },
      {
        "@type": "Question",
        "name": "O que acontece se o DJ ficar doente no dia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Amplify Eventos possui uma equipe de profissionais qualificados e um plano de contingência. Em caso de imprevistos, outro DJ treinado assume o evento, garantindo que seu casamento aconteça sem problemas."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês fazem casamentos em fazendas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, temos ampla experiência com casamentos em fazendas e locais ao ar livre na região de Goiânia. Planejamos toda a logística, incluindo proteção de equipamentos e, quando necessário, geradores de energia."
        }
      },
      {
        "@type": "Question",
        "name": "Qual a diferença entre sonorização e DJ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sonorização refere-se ao equipamento de som (caixas, microfones, mesa). DJ é o profissional que opera o equipamento e seleciona as músicas. A Amplify Eventos oferece os dois serviços integrados para garantir qualidade e harmonia."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-[url('/hero-wedding.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Seu Casamento Merece uma <span className="text-blue-500">Pista de Dança Inesquecível</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-200 mb-8 font-light">
            Som cristalino, iluminação envolvente e a trilha sonora perfeita para o dia mais importante da sua vida em Goiânia.
          </p>
          <a 
            href="https://wa.me/5562999999999?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20para%20casamento" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform hover:scale-105 shadow-lg shadow-green-900/20"
          >
            Solicitar Orçamento no WhatsApp
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-4">Estética Impecável</h3>
              <p className="text-zinc-400">
                Equipamentos modernos que compõem com a decoração. Nada de "torres feias" ou fios expostos atrapalhando suas fotos.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-4">Confiabilidade Total</h3>
              <p className="text-zinc-400">
                Backup de equipamentos e equipe técnica dedicada. Seu sonho não pode parar por causa de uma falha técnica.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold mb-4">Repertório Personalizado</h3>
              <p className="text-zinc-400">
                Reunião prévia com os noivos para alinhar cada momento, da música da cerimônia até o último hit da balada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Nossos Serviços para Casamentos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold mb-2 text-white">Sonorização de Cerimônia</h3>
                <p className="text-zinc-300 text-sm">Microfones discretos e caixas de alta fidelidade para que todos ouçam o "Sim" com clareza.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold mb-2 text-white">Iluminação Cênica</h3>
                <p className="text-zinc-300 text-sm">Valorize a decoração do salão com luzes âmbar e focais que transformam o ambiente.</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h3 className="text-2xl font-bold mb-2 text-white">Pista de Dança (DJ + VJ)</h3>
                <p className="text-zinc-300 text-sm">Estruturas de Grid, Moving Heads e Painel de LED para animar a festa até o fim.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">Dúvidas Frequentes</h2>
          <div className="space-y-6">
            <details className="group bg-zinc-900 rounded-xl p-6 cursor-pointer">
              <summary className="font-bold text-lg list-none flex justify-between items-center text-white">
                Vocês atendem em toda Goiânia e Aparecida?
                <span className="text-blue-500 transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Sim, atendemos Goiânia, Aparecida de Goiânia, Trindade, Anápolis e cidades vizinhas. O frete e a montagem já estão inclusos no orçamento para a região metropolitana.
              </p>
            </details>
            <details className="group bg-zinc-900 rounded-xl p-6 cursor-pointer">
              <summary className="font-bold text-lg list-none flex justify-between items-center text-white">
                O DJ toca o que a gente pedir?
                <span className="text-blue-500 transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Com certeza! O repertório é 100% alinhado com o gosto do casal. Fazemos uma reunião de briefing musical para entender exatamente o que vocês amam (e o que odeiam).
              </p>
            </details>
            <details className="group bg-zinc-900 rounded-xl p-6 cursor-pointer">
              <summary className="font-bold text-lg list-none flex justify-between items-center text-white">
                Com quanto tempo de antecedência devo reservar?
                <span className="text-blue-500 transform group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Datas concorridas (sábados e feriados) costumam ser reservadas com 6 a 12 meses de antecedência. Recomendamos entrar em contato o quanto antes para garantir sua data.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer & Final CTA */}
      <footer className="py-20 bg-black border-t border-zinc-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Garanta a data do seu casamento hoje mesmo</h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Não deixe para a última hora. A agenda para 2026 já está aberta e preenchendo rápido.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a 
              href="https://wa.me/5562999999999?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors w-full md:w-auto"
            >
              Solicitar Orçamento no WhatsApp
            </a>
            <Link href="/blog" className="text-zinc-400 hover:text-white font-medium py-4 px-8 border border-zinc-800 hover:border-zinc-700 rounded-full transition-colors w-full md:w-auto">
              Ver Dicas no Blog
            </Link>
          </div>
          <div className="mt-16 text-zinc-600 text-sm">
            <p className="mb-2">Amplify Eventos - Som e Iluminação Profissional</p>
            <p>Goiânia - GO | (62) 99999-9999</p>
            <p className="mt-4">© 2026 Amplify Eventos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
