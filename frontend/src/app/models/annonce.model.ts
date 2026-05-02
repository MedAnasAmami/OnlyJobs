// Correspond à la table annonce
export interface Annonce {
  idAnnonce?: number;
  titre: string;
  description: string;
  categorie: string;
  delai: number;
  image?: string;
  dateCreation: string;
  statut?: string;
  freelancer_id: number;
}

export interface AnnonceCreate {
  titre: string;
  description: string;
  categorie: string;
  delai: number;
  image?: string;
  dateCreation: string;
  freelancer_id: number;
}

export interface AnnonceUpdate {
  titre?: string;
  description?: string;
  categorie?: string;
  delai?: number;
  image?: string;
  dateCreation?: string;
}
