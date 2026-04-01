// Correspond à la table profil
export interface Profil {
  idProfil?: number;
  photo?: string;
  description?: string;
  competences?: string;
  experience?: string;
  freelancer_id: number;
}

export interface ProfilCreate {
  photo: string;
  description: string;
  competences: string;
  experience: string;
  freelancer_id: number;
}

export interface ProfilUpdate {
  photo?: string;
  description?: string;
  competences?: string;
  experience?: string;
}
