import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService, PendingProfil, PendingAnnonce } from '../../services/moderation.service';
import { AnnonceService } from '../../services/annonce.service';
import { ToastService } from '../../services/toast.service';
import { Report } from '../../models/report.model';

@Component({
  selector: 'app-admin-moderation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="moderation-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-shield-check text-primary me-2"></i>Moderation Admin</h2>
        <button class="btn btn-outline-primary btn-sm" (click)="refresh()">
          <i class="bi bi-arrow-clockwise me-1"></i>Actualiser
        </button>
      </div>

      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" [class.active]="tab() === 'profils'" href="#" (click)="tab.set('profils'); $event.preventDefault()">
            <i class="bi bi-person-badge me-1"></i>
            Profils en attente
            <span class="badge bg-warning text-dark ms-1">{{ pendingProfils().length }}</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="tab() === 'annonces'" href="#" (click)="tab.set('annonces'); $event.preventDefault()">
            <i class="bi bi-megaphone me-1"></i>
            Annonces en attente
            <span class="badge bg-warning text-dark ms-1">{{ pendingAnnonces().length }}</span>
          </a>
        </li>

        <li class="nav-item">
          <a class="nav-link" [class.active]="tab() === 'reports'" href="#" (click)="tab.set('reports'); $event.preventDefault()">
            <i class="bi bi-flag-fill me-1"></i>
            Signalements
            <span class="badge bg-warning text-dark ms-1">{{ pendingReportsCount() }}</span>
          </a>
        </li>
      </ul>

      @if (tab() === 'profils') {
        @if (pendingProfils().length === 0) {
          <div class="text-center text-muted py-5">
            <i class="bi bi-check2-circle display-4"></i>
            <p class="mt-2">Aucun profil en attente</p>
          </div>
        } @else {
          <div class="row g-3">
            @for (p of pendingProfils(); track p.idProfil) {
              <div class="col-md-6">
                <div class="card shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title mb-1">
                      <i class="bi bi-person-circle me-1"></i>{{ p.freelancer_nom }}
                    </h5>
                    <p class="text-muted small mb-2">{{ p.freelancer_email }}</p>
                    <p class="mb-1"><strong>Description :</strong> {{ p.description || '-' }}</p>
                    <p class="mb-1"><strong>Competences :</strong> {{ p.competences || '-' }}</p>
                    <p class="mb-3"><strong>Experience :</strong> {{ p.experience || '-' }}</p>
                    <div class="d-flex gap-2">
                      <button class="btn btn-success btn-sm" (click)="acceptProfil(p)">
                        <i class="bi bi-check-lg me-1"></i>Accepter
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="rejectProfil(p)">
                        <i class="bi bi-x-lg me-1"></i>Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }

      @if (tab() === 'annonces') {
        @if (pendingAnnonces().length === 0) {
          <div class="text-center text-muted py-5">
            <i class="bi bi-check2-circle display-4"></i>
            <p class="mt-2">Aucune annonce en attente</p>
          </div>
        } @else {
          <div class="row g-3">
            @for (a of pendingAnnonces(); track a.idAnnonce) {
              <div class="col-md-6">
                <div class="card shadow-sm">
                  @if (a.image) {
                    <img [src]="getImageUrl(a.image)" class="card-img-top" style="max-height:200px;object-fit:cover">
                  }
                  <div class="card-body">
                    <h5 class="card-title mb-1">{{ a.titre }}</h5>
                    <p class="text-muted small mb-2">
                      <i class="bi bi-person me-1"></i>{{ a.freelancer_nom }} - {{ a.freelancer_email }}
                    </p>
                    <p class="mb-2">{{ a.description }}</p>
                    @if (a.profil_statut !== 'accepte') {
                      <div class="alert alert-warning py-2 small mb-2">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        Le profil du freelancer n'est pas encore accepte ({{ a.profil_statut || 'inexistant' }}).
                        Traitez d'abord le profil.
                      </div>
                    }
                    <div class="d-flex gap-2">
                      <button class="btn btn-success btn-sm" (click)="acceptAnnonce(a)" [disabled]="a.profil_statut !== 'accepte'">
                        <i class="bi bi-check-lg me-1"></i>Accepter
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="rejectAnnonce(a)">
                        <i class="bi bi-x-lg me-1"></i>Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }

      @if (tab() === 'reports') {
        @if (reports().length === 0) {
          <div class="text-center text-muted py-5">
            <i class="bi bi-flag display-4"></i>
            <p class="mt-2">Aucun signalement</p>
          </div>
        } @else {
          <div class="row g-3">
            @for (r of reports(); track r.id) {
              <div class="col-md-6">
                <div class="card shadow-sm">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div class="fw-semibold">
                          <i class="bi bi-flag-fill text-danger me-1"></i>
                          {{ r.raison }}
                        </div>
                        <div class="text-muted small">
                          Statut: <span class="badge bg-secondary">{{ r.statut }}</span>
                        </div>
                      </div>
                      <div class="text-muted small">#{{ r.id }}</div>
                    </div>

                    <div class="small mb-2">
                      Cible:
                      @if (r.freelancer_id) {
                        <span class="badge bg-primary">Freelancer #{{ r.freelancer_id }}</span>
                      } @else if (r.client_id) {
                        <span class="badge bg-info text-dark">Client #{{ r.client_id }}</span>
                      } @else {
                        <span class="badge bg-light text-dark">Inconnue</span>
                      }
                      <span class="ms-2 text-muted">Reporter: #{{ r.reporter_id }}</span>
                    </div>

                    @if (r.description) {
                      <div class="border rounded p-2 small mb-2">{{ r.description }}</div>
                    } @else {
                      <div class="text-muted small mb-2">(Pas de description)</div>
                    }

                    <div class="d-flex gap-2">
                      <button class="btn btn-success btn-sm" (click)="markReportTreated(r)" [disabled]="r.statut === 'traite'">
                        <i class="bi bi-check-lg me-1"></i>Traite
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="rejectReport(r)" [disabled]="r.statut === 'rejete'">
                        <i class="bi bi-x-lg me-1"></i>Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .moderation-container { padding: 1rem 0; }
    .nav-tabs .nav-link { cursor: pointer; }
  `]
})
export class AdminModerationComponent implements OnInit {
  tab = signal<'profils' | 'annonces' | 'reports'>('profils');
  pendingProfils = signal<PendingProfil[]>([]);
  pendingAnnonces = signal<PendingAnnonce[]>([]);
  reports = signal<Report[]>([]);

  constructor(
    private moderationService: ModerationService,
    private annonceService: AnnonceService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  pendingReportsCount(): number {
    return this.reports().filter(r => r.statut === 'en_attente').length;
  }

  refresh(): void {
    this.moderationService.getPendingProfils().subscribe({
      next: (data) => this.pendingProfils.set(data),
      error: () => this.toastService.error('Erreur chargement profils')
    });
    this.moderationService.getPendingAnnonces().subscribe({
      next: (data) => this.pendingAnnonces.set(data),
      error: () => this.toastService.error('Erreur chargement annonces')
    });

    this.moderationService.getReports().subscribe({
      next: (data) => this.reports.set(data),
      error: () => this.toastService.error('Erreur chargement signalements')
    });
  }

  getImageUrl(path: string | undefined): string {
    return this.annonceService.getImageUrl(path);
  }

  acceptProfil(p: PendingProfil): void {
    this.moderationService.setProfilStatus(p.idProfil, 'accepte').subscribe({
      next: () => { this.toastService.success('Profil accepte'); this.refresh(); },
      error: () => this.toastService.error('Erreur')
    });
  }

  rejectProfil(p: PendingProfil): void {
    this.moderationService.setProfilStatus(p.idProfil, 'rejete').subscribe({
      next: () => { this.toastService.success('Profil rejete'); this.refresh(); },
      error: () => this.toastService.error('Erreur')
    });
  }

  acceptAnnonce(a: PendingAnnonce): void {
    this.moderationService.setAnnonceStatus(a.idAnnonce, 'accepte').subscribe({
      next: () => { this.toastService.success('Annonce acceptee'); this.refresh(); },
      error: (err) => this.toastService.error(err?.error?.detail || 'Erreur')
    });
  }

  rejectAnnonce(a: PendingAnnonce): void {
    this.moderationService.setAnnonceStatus(a.idAnnonce, 'rejete').subscribe({
      next: () => { this.toastService.success('Annonce rejetee'); this.refresh(); },
      error: () => this.toastService.error('Erreur')
    });
  }

  markReportTreated(r: Report): void {
    this.moderationService.setReportStatus(r.id, 'traite').subscribe({
      next: () => { this.toastService.success('Signalement traite'); this.refresh(); },
      error: (err) => this.toastService.error(err?.error?.detail || 'Erreur')
    });
  }

  rejectReport(r: Report): void {
    this.moderationService.setReportStatus(r.id, 'rejete').subscribe({
      next: () => { this.toastService.success('Signalement rejete'); this.refresh(); },
      error: (err) => this.toastService.error(err?.error?.detail || 'Erreur')
    });
  }
}
