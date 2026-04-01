// Correspond à la table annonce
export interface Annonce {
  idAnnonce?: number;
  titre: string;
  description: string;
  image?: string;
  dateCreation: string;
  freelancer_id: number;
}

export interface AnnonceCreate {
  titre: string;
  description: string;
  image?: string;
  dateCreation: string;
  freelancer_id: number;
}

export interface AnnonceUpdate {
  titre?: string;
  description?: string;
  image?: string;
  dateCreation?: string;
}
