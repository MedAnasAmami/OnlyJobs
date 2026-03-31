import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Freelancer, FreelancerDetail } from '../models/freelancer.model';
import { Profil } from '../models/profil.model';

// Stats adaptees au nouveau backend
export interface Stats {
  total_utilisateurs: number;
  total_freelancers: number;
  total_clients: number;
  total_annonces: number;
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
}
