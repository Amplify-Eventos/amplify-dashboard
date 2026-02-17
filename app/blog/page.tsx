import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Amplify Eventos | Som e Iluminação para Casamentos',
  description: 'Dicas e guias sobre som, iluminação e DJ para casamentos em Goiânia e região.',
};

const posts = [
  {
    slug: 'quanto-custa-dj-casamento-goiania',
    title: 'Quanto Custa um DJ para Casamento em Goiânia? (Guia 2026)',
    excerpt: 'Descubra os preços médios, o que está incluso nos pacotes e como escolher o melhor custo-benefício para seu evento.',
    date: '17 de Fevereiro, 2026',
    readTime: '5 min de leitura',
    category: 'Orçamento',
  },
  {
    slug: '10-dicas-escolher-som-casamento',
    title: '10 Dicas para Escolher o Som do Seu Casamento',
    excerpt: 'Um guia completo para garantir a melhor sonorização, iluminação e DJ para sua festa ser inesquecível.',
    date: '17 de Fevereiro, 2026',
    readTime: '7 min de leitura',
    category: 'Planejamento',
  },
];

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Blog Amplify</h1>
        <p className="text-zinc-400 text-lg">
          Tudo sobre som, iluminação e DJs para casamentos em Goiânia.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group block bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-400 text-sm mb-4">
                {post.excerpt}
              </p>
              <div className="text-zinc-500 text-xs">
                {post.date}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
