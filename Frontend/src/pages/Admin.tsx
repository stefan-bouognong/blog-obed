import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { useBlog } from '@/context/BlogContext';
import { Article, CreateArticleData, UpdateArticleData } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const emptyArticle: CreateArticleData = {
  titre: '',
  contenu: '',
  image_url: null,
  categorie: 'BELGIQUE',
};

const Admin = () => {
  const { articles, loading, addArticle, updateArticle, deleteArticle } = useBlog();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CreateArticleData | (UpdateArticleData & { id?: number })>(emptyArticle);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingArticle(emptyArticle);
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({
      id: article.id,
      titre: article.titre,
      contenu: article.contenu,
      image_url: article.image_url,
      categorie: article.categorie,
    });
    setImageFile(null);
    setImagePreview(article.image_url || null);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (articleToDelete) {
      try {
        await deleteArticle(articleToDelete);
        toast({
          title: 'Article supprimé',
          description: "L'article a été supprimé avec succès.",
        });
        setDeleteDialogOpen(false);
        setArticleToDelete(null);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: error instanceof Error ? error.message : 'Erreur lors de la suppression',
          variant: 'destructive',
        });
      }
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log('Cloudinary Config:', {
      CLOUDINARY_URL: CLOUDINARY_URL ? '✓ Défini' : '✗ Manquant',
      UPLOAD_PRESET: UPLOAD_PRESET ? '✓ Défini' : '✗ Manquant',
    });

    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      throw new Error(
        `Configuration Cloudinary manquante. VITE_CLOUDINARY_URL: ${CLOUDINARY_URL ? 'OK' : 'MANQUANT'}, VITE_CLOUDINARY_UPLOAD_PRESET: ${UPLOAD_PRESET ? 'OK' : 'MANQUANT'}. Assurez-vous que le fichier .env est à la racine de Frontend/ (pas dans src/) et redémarrez le serveur de développement.`
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    // Extraire cloud_name de VITE_CLOUDINARY_URL ou utiliser VITE_CLOUDINARY_CLOUD_NAME
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 
      CLOUDINARY_URL.match(/res\.cloudinary\.com\/([^/]+)/)?.[1] || 
      CLOUDINARY_URL;
    
    if (cloudName) {
      formData.append('cloud_name', cloudName);
    }

    const res = await fetch(`${CLOUDINARY_URL}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Erreur Cloudinary:', text);
      throw new Error('Erreur upload Cloudinary');
    }

    const data = await res.json();
    return data.secure_url;
  };

  const handleSave = async () => {
    if (!editingArticle.titre || !editingArticle.contenu) {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir au moins le titre et le contenu.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = editingArticle.image_url || null;

      // Upload de l'image si un nouveau fichier a été sélectionné
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      if ('id' in editingArticle && editingArticle.id) {
        await updateArticle(editingArticle.id, {
          titre: editingArticle.titre,
          contenu: editingArticle.contenu,
          image_url: imageUrl,
          categorie: editingArticle.categorie,
        });
        toast({
          title: 'Article mis à jour',
          description: 'Vos modifications ont été enregistrées.',
        });
      } else {
        await addArticle({
          titre: editingArticle.titre,
          contenu: editingArticle.contenu,
          image_url: imageUrl,
          categorie: editingArticle.categorie,
        });
        toast({
          title: 'Article créé',
          description: 'Votre nouvel article a été publié.',
        });
      }
      
      setIsEditing(false);
      setEditingArticle(emptyArticle);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Administration
              </h1>
              <p className="text-muted-foreground">
                Gérez vos articles de blog
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Note: Vous devez être connecté en tant qu'administrateur via{' '}
                <a href="https://backend-blog-6oio.onrender.com/admin" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  l'interface Django /admin
                </a>{' '}
                pour créer, modifier ou supprimer des articles.
              </p>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvel Article
            </Button>
          </div>

          {/* Articles List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {loading ? (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">Chargement des articles...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm">
                          Article
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm hidden md:table-cell">
                          Date de création
                        </th>
                        <th className="text-right py-4 px-6 font-medium text-muted-foreground text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedArticles.map((article, index) => (
                        <motion.tr
                          key={article.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              {article.image_url && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                                  <img
                                    src={article.image_url}
                                    alt={article.titre}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-xs">
                                  {article.titre}
                                </p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">
                                  {article.contenu.substring(0, 100)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell text-muted-foreground">
                            {format(new Date(article.created_at), 'd MMM yyyy')}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/blog/${article.id}`}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Voir l'article"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleEdit(article)}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Modifier l'article"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Supprimer l'article"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {articles.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-muted-foreground mb-4">Aucun article pour le moment</p>
                    <Button onClick={handleCreate} variant="outline">
                      Créer votre premier article
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {'id' in editingArticle && editingArticle.id ? 'Modifier l\'article' : 'Créer un nouvel article'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les détails de votre article
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Titre *
              </label>
              <Input
                value={editingArticle.titre || ''}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, titre: e.target.value })
                }
                placeholder="Titre de l'article"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Catégorie *
              </label>
              <select
                value={editingArticle.categorie || 'BELGIQUE'}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, categorie: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-background"
              >
                <option value="BELGIQUE">
                  Économie et Société – Belgique
                </option>
                <option value="CONGO">
                  Économie et Société – République du Congo
                </option>
                <option value="FINANCE">
                  Finance et Gestion
                </option>
              </select>
            </div>

            <div>
              <Label>Image de l'article</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-h-48 rounded-md border"
                />
              )}
            </div>


            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Contenu *
              </label>
              <Textarea
                value={editingArticle.contenu || ''}
                onChange={(e) =>
                  setEditingArticle({ ...editingArticle, contenu: e.target.value })
                }
                placeholder="Écrivez le contenu de votre article ici. Utilisez ## pour les titres et **texte** pour le gras."
                rows={12}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setImageFile(null);
              setImagePreview(null);
            }}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              {'id' in editingArticle && editingArticle.id ? 'Enregistrer les modifications' : 'Créer l\'article'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
