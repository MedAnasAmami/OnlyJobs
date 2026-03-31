import { Profil } from './profil.model';

// Correspond à la table freelancer
export interface Freelancer {
  id: number;
  status: string;
}

// Freelancer avec données utilisateur jointes (pour l'affichage)
export interface FreelancerDetail {
  id: number;
  status: string;
  nom: string;
  email: string;
  telephone: string;
  profil?: Profil;
}

export interface FreelancerCreate {
  status: string;
}
