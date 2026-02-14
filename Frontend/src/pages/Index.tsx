import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { BlogCard } from '@/components/blog/BlogCard';
import { FounderImage } from '@/components/FounderImage';
import { useBlog } from '@/context/BlogContext';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'BELGIQUE', label: 'Économie et Société – Belgique' },
  { value: 'CONGO', label: 'Économie et Société – République du Congo' },
  { value: 'FINANCE', label: 'Finance et Gestion' },
];

const Index = () => {
  const { articles } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

  // 🔥 Filtrage + tri
  const filteredArticles = useMemo(() => {
    const sorted = [...articles].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

    if (selectedCategory === 'all') return sorted;

    return sorted.filter(
      (article) => article.categorie === selectedCategory
    );
  }, [articles, selectedCategory]);

  // 🔥 Image aléatoire pour hero
  const randomHeroImage = useMemo(() => {
    if (articles.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * articles.length);
    return articles[randomIndex].image_url || '';
  }, [articles]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          {randomHeroImage && (
            <img
              src={randomHeroImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <FounderImage variant="hero" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Forum de Pensée Critique
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Analyses économiques, sociales et financières pour la Belgique et la République du Congo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">

            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              Tous les articles
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                )}
              >
                {cat.label}
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun article dans cette catégorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <BlogCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
