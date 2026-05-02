export interface Service {
  idService?: number;
  titre: string;
  description?: string;
  delai: number;
  categorie: string;
  statut?: string;
  freelancer_id: number;
  annonce_id?: number | null;
  client_id?: number | null;
  date_choix?: string | null;
}

export interface ServiceCreate {
  titre: string;
  description?: string;
  delai: number;
  categorie: string;
  statut?: string;
  freelancer_id: number;
  annonce_id?: number | null;
  client_id?: number | null;
}

export interface ServiceUpdate {
  titre?: string;
  description?: string;
  delai?: number;
  categorie?: string;
  statut?: string;
  annonce_id?: number | null;
  client_id?: number | null;
  date_choix?: string | null;
}
