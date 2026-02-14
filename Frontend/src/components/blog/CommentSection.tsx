import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MessageCircle, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Commentaire } from '@/types/blog';
import * as api from '@/lib/api';

interface CommentSectionProps {
  articleId: number;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Commentaire[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les commentaires depuis l'API
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getComments(articleId);
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commentaires');
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await api.createComment({
        nom: name.trim() || 'Anonymous',
        message: trimmedMessage,
        article: articleId,
      });

      // Éviter doublons
      setComments(prev => [newComment, ...prev.filter(c => c.id !== newComment.id)]);
      setName('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Commentaires ({comments.length})
      </h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}
        <Input
          placeholder="Votre nom (optionnel)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="max-w-sm"
        />
        <Textarea
          placeholder="Partagez vos pensées..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={isSubmitting || !message.trim()}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Envoi...' : 'Publier le commentaire'}
        </Button>
      </form>

      {/* Liste des commentaires */}
      {loading ? (
        <p className="text-muted-foreground text-center py-8">Chargement des commentaires...</p>
      ) : (
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun commentaire pour le moment. Soyez le premier à partager vos pensées !
            </p>
          ) : (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-secondary/50 rounded-lg p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{comment.nom || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(comment.created_at), 'd MMM yyyy · HH:mm')}
                    </p>
                  </div>
                </div>
                <p className="text-foreground/90 leading-relaxed">{comment.message}</p>
              </motion.div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
