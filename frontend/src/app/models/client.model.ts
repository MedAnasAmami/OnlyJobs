// Correspond à la table client (hérite de utilisateur)
export interface Client {
  id: number;
}

// Client avec données utilisateur jointes (pour l'affichage)
export interface ClientDetail {
  id: number;
  nom: string;
  email: string;
  telephone: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  role: 'client' | 'freelancer' | 'admin';
}
