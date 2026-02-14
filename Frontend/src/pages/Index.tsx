import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { BlogCard } from '@/components/blog/BlogCard';
import { FounderImage } from '@/components/FounderImage';
import { useBlog } from '@/context/BlogContext';

const Index = () => {
  const { articles, loading } = useBlog();

  // Trier les articles par date de création (plus récents en premier)
  const sortedArticles = useMemo(() => {
    return [...articles].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [articles]);

  // Obtenir une image aléatoire pour le hero
  const randomHeroImage = useMemo(() => {
    if (articles.length === 0) return '';
    const randomIndex = Math.floor(Math.random() * articles.length);
    return articles[randomIndex].image_url || '';
  }, [articles]);

  return (
    <Layout>
      {/* Hero Section with Random Background */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image */}
        {randomHeroImage && (
          <div className="absolute inset-0">
            <img
              src={randomHeroImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
          </div>
        )}
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {/* Founder Image */}
            <FounderImage variant="hero" />
            
            {/* Hero Text */}
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

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des articles...</p>
            </div>
          ) : sortedArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun article disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedArticles.map((article, index) => (
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
