import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service, ServiceCreate, ServiceUpdate } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getServices(params?: { categorie?: string; annonce_id?: number | null }): Observable<Service[]> {
    const query: string[] = [];
    if (params?.categorie) {
      query.push(`categorie=${encodeURIComponent(params.categorie)}`);
    }
    if (params?.annonce_id !== undefined && params?.annonce_id !== null) {
      query.push(`annonce_id=${params.annonce_id}`);
    }
    const queryString = query.length ? `?${query.join('&')}` : '';
    return this.http.get<Service[]>(`${this.apiUrl}/services${queryString}`);
  }

  getService(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/services/${serviceId}`);
  }

  getAnnonceServices(annonceId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/annonces/${annonceId}/services`);
  }

  createService(payload: ServiceCreate): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/services`, payload);
  }

  updateService(serviceId: number, payload: ServiceUpdate): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/services/${serviceId}`, payload);
  }

  chooseService(serviceId: number, clientId: number): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/services/${serviceId}/choose`, { client_id: clientId });
  }

  markServiceDone(serviceId: number): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/services/${serviceId}/done`, {});
  }

  deleteService(serviceId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/services/${serviceId}`);
  }
}
