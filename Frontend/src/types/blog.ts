// Types correspondant exactement au backend Django

export interface Article {
  id: number;
  titre: string;
  contenu: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  categorie: string;
  admin: number; // ID de l'utilisateur
}

export interface Commentaire {
  id: number;
  nom: string;
  message: string;
  article: number; // ID de l'article
  created_at: string;
}

// Types pour les formulaires (sans les champs read-only)
export interface CreateArticleData {
  titre: string;
  contenu: string;
  image_url?: string | null;
  categorie: string;
}

export interface UpdateArticleData {
  titre?: string;
  contenu?: string;
  image_url?: string | null;
  categorie?: string;
}

export interface CreateCommentaireData {
  nom: string;
  message: string;
  article: number;
}
