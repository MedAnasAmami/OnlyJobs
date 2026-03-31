import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profil, ProfilCreate, ProfilUpdate } from '../models/profil.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste tous les profils
  getProfils(): Observable<Profil[]> {
    return this.http.get<Profil[]>(`${this.apiUrl}/profils`);
  }

  // Obtenir un profil par ID
  getProfil(id: number): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/profils/${id}`);
  }

  // Obtenir le profil d'un freelancer
  getProfilByFreelancer(freelancerId: number): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/freelancers/${freelancerId}/profil`);
  }

  // Creer un profil
  createProfil(profil: ProfilCreate): Observable<Profil> {
    return this.http.post<Profil>(`${this.apiUrl}/profils`, profil);
  }

  // Mettre a jour un profil
  updateProfil(id: number, profil: ProfilUpdate): Observable<Profil> {
    return this.http.put<Profil>(`${this.apiUrl}/profils/${id}`, profil);
  }
}
