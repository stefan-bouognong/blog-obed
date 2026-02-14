import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, CreateArticleData, UpdateArticleData } from '@/types/blog';
import * as api from '@/lib/api';

interface BlogContextType {
  articles: Article[];
  loading: boolean;
  error: string | null;
  token: string | null;
  setToken: (token: string | null) => void;
  addArticle: (data: CreateArticleData) => Promise<void>;
  updateArticle: (id: number, data: UpdateArticleData) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
  getArticle: (id: number) => Article | undefined;
  refreshArticles: () => Promise<void>;
  getLatestArticles: (count: number, excludeId?: number) => Article[];
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children, token: initialToken }: { children: ReactNode, token?: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(initialToken || null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await api.getArticles();
      setArticles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const addArticle = async (data: CreateArticleData) => {
    if (!token) throw new Error('Non authentifié');
    const newArticle = await api.createArticle(data, token);
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = async (id: number, data: UpdateArticleData) => {
    if (!token) throw new Error('Non authentifié');
    const updatedArticle = await api.updateArticle(id, data, token);
    setArticles(prev => prev.map(a => (a.id === id ? updatedArticle : a)));
  };

  const deleteArticle = async (id: number) => {
    if (!token) throw new Error('Non authentifié');
    await api.deleteArticle(id, token);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const getArticle = (id: number) => articles.find(a => a.id === id);

  const refreshArticles = async () => {
    await loadArticles();
  };

  // 🔥 Fonction pour récupérer les derniers articles
  const getLatestArticles = (count: number, excludeId?: number) => {
    let filtered = articles;
    if (excludeId) filtered = filtered.filter(a => a.id !== excludeId);
    return filtered
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  };

  return (
    <BlogContext.Provider value={{
      articles,
      loading,
      error,
      token,
      setToken,
      addArticle,
      updateArticle,
      deleteArticle,
      getArticle,
      refreshArticles,
      getLatestArticles, // ✅ ajouté ici
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be utilisé à l’intérieur de BlogProvider');
  return context;
}
