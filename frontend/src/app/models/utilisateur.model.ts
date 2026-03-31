// Correspond à la table utilisateur (entité mère)
export interface Utilisateur {
  id?: number;
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
}

export interface UtilisateurResponse {
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
