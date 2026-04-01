import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// Types pour l'authentification
export interface UtilisateurResponse {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: 'client' | 'freelancer' | 'admin';
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  role: 'client' | 'freelancer' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private storageKey = 'onlyjobs_user';

  currentUser = signal<UtilisateurResponse | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);
  isFreelancer = computed(() => this.currentUser()?.role === 'freelancer');
  isClient = computed(() => this.currentUser()?.role === 'client');
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  login(credentials: LoginRequest): Observable<UtilisateurResponse> {
    return this.http.post<UtilisateurResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      })
    );
  }

  register(data: RegisterRequest): Observable<UtilisateurResponse> {
    return this.http.post<UtilisateurResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);
  }
}
