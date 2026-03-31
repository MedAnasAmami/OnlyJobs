export interface Rating {
  id: number;
  note: number;
  commentaire: string;
  date_creation: string;
  freelancer_id: number;
  client_id: number;
  client_nom?: string;
  client_prenom?: string;
}

export interface RatingRequest {
  note: number;
  commentaire: string;
  freelancer_id: number;
  client_id: number;
}
