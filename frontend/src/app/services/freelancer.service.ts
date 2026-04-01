import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Freelancer, FreelancerDetail } from '../models/freelancer.model';
import { Profil } from '../models/profil.model';
import { Rating, RatingRequest } from '../models/rating.model';
import { Report, ReportRequest } from '../models/report.model';

// Stats adaptees au nouveau backend
export interface Stats {
  total_utilisateurs: number;
  total_freelancers: number;
  total_clients: number;
  total_annonces: number;
  total_ratings: number;
  total_reports: number;
  moyenne_generale: number;
}

export interface AverageRating {
  average: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class FreelancerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste tous les freelancers
  getFreelancers(): Observable<Freelancer[]> {
    return this.http.get<Freelancer[]>(`${this.apiUrl}/freelancers`);
  }

  // Obtenir un freelancer par ID
  getFreelancer(id: number): Observable<Freelancer> {
    return this.http.get<Freelancer>(`${this.apiUrl}/freelancers/${id}`);
  }

  // Obtenir un freelancer avec ses details (utilisateur + profil)
  getFreelancerDetail(id: number): Observable<FreelancerDetail> {
    return this.http.get<FreelancerDetail>(`${this.apiUrl}/freelancers/${id}/detail`);
  }

  // Obtenir le profil d'un freelancer
  getFreelancerProfil(freelancerId: number): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/freelancers/${freelancerId}/profil`);
  }

  // Obtenir les statistiques
  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }

  // ============= RATINGS =============

  // Creer une notation
  createRating(ratingData: RatingRequest): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/ratings`, ratingData);
  }

  // Obtenir les ratings d'un freelancer
  getFreelancerRatings(freelancerId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/freelancers/${freelancerId}/ratings`);
  }

  // Obtenir la note moyenne d'un freelancer
  getFreelancerAverageRating(freelancerId: number): Observable<AverageRating> {
    return this.http.get<AverageRating>(`${this.apiUrl}/freelancers/${freelancerId}/average-rating`);
  }

  // ============= REPORTS =============

  // Creer un signalement
  createReport(reportData: ReportRequest): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports`, reportData);
  }

  // Obtenir tous les signalements (admin)
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/reports`);
  }

  // Obtenir les signalements d'un freelancer
  getFreelancerReports(freelancerId: number): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/freelancers/${freelancerId}/reports`);
  }
}
