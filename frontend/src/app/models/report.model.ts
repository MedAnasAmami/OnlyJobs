export interface Report {
  id: number;
  raison: string;
  description?: string;
  date_creation: string;
  statut: string;
  freelancer_id: number;
  reporter_id: number;
}

export interface ReportRequest {
  raison: string;
  description?: string;
  freelancer_id: number;
  reporter_id: number;
}

export type ReportReason = 'spam' | 'comportement' | 'fraude' | 'contenu_inapproprie' | 'autre';
