import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Report } from '../models/report.model';

export interface PendingProfil {
  idProfil: number;
  photo?: string;
  description?: string;
  competences?: string;
  experience?: string;
  statut: string;
  freelancer_id: number;
  freelancer_nom: string;
  freelancer_email: string;
}

export interface PendingAnnonce {
  idAnnonce: number;
  titre: string;
  description: string;
  image?: string;
  dateCreation?: string;
  statut: string;
  freelancer_id: number;
  freelancer_nom: string;
  freelancer_email: string;
  profil_statut: string | null;
}

@Injectable({ providedIn: 'root' })
export class ModerationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPendingProfils(): Observable<PendingProfil[]> {
    return this.http.get<PendingProfil[]>(`${this.apiUrl}/admin/profils/pending`);
  }

  getPendingAnnonces(): Observable<PendingAnnonce[]> {
    return this.http.get<PendingAnnonce[]>(`${this.apiUrl}/admin/annonces/pending`);
  }

  setProfilStatus(profilId: number, statut: 'accepte' | 'rejete' | 'en_attente'): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/profils/${profilId}/status`, { statut });
  }

  setAnnonceStatus(annonceId: number, statut: 'accepte' | 'rejete' | 'en_attente'): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/annonces/${annonceId}/status`, { statut });
  }

  // Reports
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/reports`);
  }

  setReportStatus(reportId: number, statut: 'en_attente' | 'traite' | 'rejete'): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/reports/${reportId}/status`, { statut });
  }
}
