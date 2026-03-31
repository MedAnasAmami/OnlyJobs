import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Annonce, AnnonceCreate, AnnonceUpdate } from '../models/annonce.model';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste toutes les annonces
  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/annonces`);
  }

  // Obtenir une annonce par ID
  getAnnonce(id: number): Observable<Annonce> {
    return this.http.get<Annonce>(`${this.apiUrl}/annonces/${id}`);
  }

  // Obtenir les annonces d'un freelancer
  getAnnoncesByFreelancer(freelancerId: number): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiUrl}/freelancers/${freelancerId}/annonces`);
  }

  // Creer une annonce
  createAnnonce(annonce: AnnonceCreate): Observable<Annonce> {
    return this.http.post<Annonce>(`${this.apiUrl}/annonces`, annonce);
  }

  // Mettre a jour une annonce
  updateAnnonce(id: number, annonce: AnnonceUpdate): Observable<Annonce> {
    return this.http.put<Annonce>(`${this.apiUrl}/annonces/${id}`, annonce);
  }

  // Supprimer une annonce
  deleteAnnonce(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/annonces/${id}`);
  }
}
