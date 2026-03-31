// Correspond à la table admin (hérite de utilisateur)
export interface Admin {
  id: number;
}

// Admin avec données utilisateur jointes (pour l'affichage)
export interface AdminDetail {
  id: number;
  nom: string;
  email: string;
  telephone: string;
}
