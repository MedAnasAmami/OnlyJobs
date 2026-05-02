import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Annonce } from '../../models/annonce.model';
import { Service } from '../../models/service.model';
import { AnnonceService } from '../../services/annonce.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { FreelancerService } from '../../services/freelancer.service';
import { ServiceService } from '../../services/service.service';
import { ReportModalComponent } from '../report-modal/report-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportModalComponent],
  template: `
    <div class="annonces-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-megaphone text-primary me-2"></i>Annonces</h2>
        @if (authService.isFreelancer()) {
          <button class="btn btn-primary" (click)="openCreateModal()">
            <i class="bi bi-plus-lg me-1"></i>Nouvelle Annonce
          </button>
        }
      </div>

      <div class="row g-2 mb-4">
        <div class="col-md-5">
          <input
            type="text"
            class="form-control"
            placeholder="Rechercher par nom d'annonce..."
            [(ngModel)]="annonceQuery">
        </div>
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="selectedCategorie">
            <option value="">Toutes les categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-center text-muted small">
          @if (servicesLoading()) {
            <span><i class="bi bi-arrow-repeat me-1"></i>Commandes: chargement...</span>
          } @else {
            <span><i class="bi bi-bag-check me-1"></i>Commandes chargees</span>
          }
        </div>
      </div>

      @if (authService.isClient() && pendingServices.length > 0) {
        <div class="alert alert-info mb-4">
          <div class="d-flex justify-content-between align-items-center">
            <div class="fw-semibold">
              <i class="bi bi-bag-check me-2"></i>
              Commandes en attente : {{ pendingServices.length }}
            </div>
          </div>
          <div class="mt-2">
            @for (s of pendingServices; track s.idService) {
              <div class="small text-muted">
                - {{ s.titre }} ({{ s.delai }} jours)
              </div>
            }
          </div>
        </div>
      }

      @if (filteredAnnonces.length === 0) {
        <div class="text-center py-5">
          <i class="bi bi-megaphone display-1 text-muted"></i>
          <p class="mt-3 text-muted">Aucune annonce disponible</p>
        </div>
      } @else {
        <div class="annonces-grid">
          @for (annonce of pagedAnnonces(); track annonce.idAnnonce) {
            <div class="annonce-card">
              @if (annonce.image) {
                <div class="annonce-image">
                  <img [src]="getImageUrl(annonce.image)" [alt]="annonce.titre">
                </div>
              }
              <div class="annonce-content">
                <div class="d-flex justify-content-between align-items-start">
                  <h3 class="mb-0">{{ annonce.titre }}</h3>
                  @if (canEditAnnonce(annonce)) {
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" (click)="openEditModal(annonce)" title="Modifier">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="confirmDelete(annonce)" title="Supprimer">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  }
                </div>

                <p class="mb-2">{{ annonce.description }}</p>

                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="date"><i class="bi bi-calendar me-1"></i>{{ annonce.dateCreation }}</span>
                  <span class="badge bg-primary"><i class="bi bi-person me-1"></i>{{ getFreelancerName(annonce.freelancer_id) }}</span>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-muted small">
                    <span class="badge bg-info me-2">{{ annonce.categorie }}</span>
                    <i class="bi bi-clock me-1"></i>{{ annonce.delai }} jours
                  </div>

                  <div class="d-flex gap-2 align-items-center">
                    @if (authService.isClient()) {
                      <button
                        class="btn btn-sm btn-outline-primary"
                        (click)="chooseAnnonce(annonce)"
                        [disabled]="hasClientOrdered(annonce.idAnnonce)">
                        <i class="bi bi-check2-circle me-1"></i>Commander
                      </button>
                    }
                  </div>
                </div>

                @if (authService.isFreelancer() && authService.currentUser()?.id === annonce.freelancer_id) {
                  <div class="service-list mt-3">
                    <h6 class="mb-2"><i class="bi bi-bag-check me-1"></i>Commandes</h6>
                    @if (getAnnonceOrders(annonce.idAnnonce).length === 0) {
                      <p class="text-muted small mb-0">Aucune commande pour cette annonce</p>
                    } @else {
                      @for (order of getAnnonceOrders(annonce.idAnnonce); track order.idService) {
                        <div class="d-flex justify-content-between align-items-center service-item">
                          <div>
                            <div class="fw-semibold">Client: #{{ order.client_id }}</div>
                            <div class="text-muted small">Statut: {{ order.statut || 'choisi' }} • {{ order.delai }} jours</div>
                          </div>
                          <div class="d-flex gap-2 align-items-center">
                            @if (order.statut === 'choisi') {
                              <button class="btn btn-sm btn-success" (click)="markServiceDone(order)">
                                <i class="bi bi-check-lg me-1"></i>Service fait
                              </button>
                              <button class="btn btn-sm btn-outline-danger" (click)="reportClient(order)">
                                <i class="bi bi-flag me-1"></i>Signaler
                              </button>
                            }
                          </div>
                        </div>
                      }
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>

        @if (filteredAnnonces.length > pageSize) {
          <nav class="mt-4" aria-label="Pagination annonces">
            <ul class="pagination justify-content-center mb-0">
              <li class="page-item" [class.disabled]="effectivePage() <= 1">
                <a class="page-link" href="#" (click)="$event.preventDefault(); prevPage()">Precedent</a>
              </li>

              @for (p of pages(); track p) {
                <li class="page-item" [class.active]="p === effectivePage()">
                  <a class="page-link" href="#" (click)="$event.preventDefault(); goToPage(p)">{{ p }}</a>
                </li>
              }

              <li class="page-item" [class.disabled]="effectivePage() >= totalPages()">
                <a class="page-link" href="#" (click)="$event.preventDefault(); nextPage()">Suivant</a>
              </li>
            </ul>
          </nav>
        }
      }
    </div>

    <!-- Order / Details Modal (Client) -->
    <div class="modal fade" id="orderAnnonceModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-bag-check me-2"></i>Commander
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            @if (annonceToOrder()) {
              <div class="mb-2">
                <div class="fw-semibold fs-5">{{ annonceToOrder()?.titre }}</div>
                <div class="text-muted small">
                  <span class="badge bg-info me-2">{{ annonceToOrder()?.categorie }}</span>
                  <i class="bi bi-clock me-1"></i>{{ annonceToOrder()?.delai }} jours
                </div>
              </div>

              <div class="mb-3">
                <div class="text-muted small mb-1">Freelancer</div>
                <div class="badge bg-primary">
                  <i class="bi bi-person me-1"></i>{{ getFreelancerName(annonceToOrder()?.freelancer_id || 0) }}
                </div>
              </div>

              <div>
                <div class="text-muted small mb-1">Description</div>
                <div class="border rounded p-3">{{ annonceToOrder()?.description }}</div>
              </div>
            }
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="confirmOrder()"
              [disabled]="submitting()">
              @if (submitting()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
              }
              <i class="bi bi-check2-circle me-1"></i>Confirmer la commande
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal (Client/Freelancer) -->
    <app-report-modal
      [clientId]="selectedClientForReport()"
      (reportSubmitted)="onClientReportSubmitted()">
    </app-report-modal>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="annonceModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-megaphone me-2"></i>
              {{ editingAnnonce() ? 'Modifier l\\'Annonce' : 'Nouvelle Annonce' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-bold">Titre *</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="formTitre"
                    placeholder="Titre de l'annonce"
                    required>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Categorie *</label>
                      <input
                        type="text"
                        class="form-control"
                        [(ngModel)]="formCategorie"
                        placeholder="Ex: Web, Design..."
                        required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label fw-bold">Delai (jours) *</label>
                      <input
                        type="number"
                        class="form-control"
                        [(ngModel)]="formDelai"
                        min="1"
                        required>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Description *</label>
                  <textarea
                    class="form-control"
                    rows="6"
                    [(ngModel)]="formDescription"
                    placeholder="Decrivez votre service en detail..."
                    required>
                  </textarea>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label fw-bold">Image</label>
                  <div class="image-upload-container">
                    @if (imagePreview()) {
                      <div class="image-preview">
                        <img [src]="imagePreview()" alt="Preview">
                        <button type="button" class="btn btn-sm btn-danger remove-image" (click)="removeImage()">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    } @else if (editingAnnonce()?.image) {
                      <div class="image-preview">
                        <img [src]="getImageUrl(editingAnnonce()?.image)" alt="Current image">
                        <button type="button" class="btn btn-sm btn-danger remove-image" (click)="removeImage()">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </div>
                    } @else {
                      <label class="upload-area" for="imageInput">
                        <i class="bi bi-cloud-upload display-4 text-muted"></i>
                        <p class="text-muted mb-0">Cliquez ou glissez une image</p>
                        <small class="text-muted">JPG, PNG, GIF, WEBP</small>
                      </label>
                    }
                    <input
                      type="file"
                      id="imageInput"
                      class="d-none"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      (change)="onImageSelected($event)">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="saveAnnonce()"
              [disabled]="submitting() || uploading()">
              @if (submitting() || uploading()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
                {{ uploading() ? 'Upload...' : '' }}
              }
              <i class="bi bi-check-lg me-1"></i>
              {{ editingAnnonce() ? 'Enregistrer' : 'Creer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteAnnonceModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>Confirmer la suppression
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Etes-vous sur de vouloir supprimer l'annonce "{{ annonceToDelete()?.titre }}" ?</p>
            <p class="text-muted mb-0">Cette action est irreversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button
              type="button"
              class="btn btn-danger"
              (click)="deleteAnnonce()"
              [disabled]="submitting()">
              @if (submitting()) {
                <span class="spinner-border spinner-border-sm me-1"></span>
              }
              <i class="bi bi-trash me-1"></i>Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .annonces-container {
      padding: 20px 0;
    }
    .annonces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .annonce-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .annonce-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    }
    .annonce-image {
      width: 100%;
      height: 180px;
      overflow: hidden;
    }
    .annonce-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .annonce-content {
      padding: 20px;
    }
    .annonce-card h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 1.2rem;
    }
    .annonce-card p {
      color: #666;
      margin: 0 0 15px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .date {
      color: #999;
      font-size: 0.9em;
    }
    .btn-group .btn {
      padding: 0.25rem 0.5rem;
    }

    .service-list {
      border-top: 1px solid #f1f3f5;
      padding-top: 12px;
    }
    .service-item {
      padding: 8px 0;
      border-bottom: 1px dashed #e9ecef;
    }
    .service-item:last-child {
      border-bottom: none;
    }

    /* Image upload styles */
    .image-upload-container {
      width: 100%;
      min-height: 200px;
    }
    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px dashed #dee2e6;
      border-radius: 12px;
      padding: 40px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      min-height: 200px;
    }
    .upload-area:hover {
      border-color: #0d6efd;
      background: #f8f9fa;
    }
    .image-preview {
      position: relative;
      width: 100%;
      height: 200px;
      border-radius: 12px;
      overflow: hidden;
    }
    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .remove-image {
      position: absolute;
      top: 10px;
      right: 10px;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AnnonceListComponent implements OnInit {
  @Input() annonces: Annonce[] = [];
  @Output() annonceUpdated = new EventEmitter<void>();

  editingAnnonce = signal<Annonce | null>(null);
  annonceToDelete = signal<Annonce | null>(null);
  annonceToOrder = signal<Annonce | null>(null);
  submitting = signal(false);
  uploading = signal(false);
  imagePreview = signal<string | null>(null);

  formTitre = '';
  formDescription = '';
  formCategorie = '';
  formDelai = 7;
  selectedFile: File | null = null;
  formImageUrl: string | null = null;

  private freelancerNames = new Map<number, string>();
  private freelancerDetailLoading = new Set<number>();

  private modal: any;
  private deleteModal: any;
  private orderModal: any;

  annonceQuery = '';
  selectedCategorie = '';
  services: Service[] = [];
  servicesLoading = signal(true);
  selectedClientForReport = signal<number | null>(null);

  // Pagination annonces
  page = signal(1);
  readonly pageSize = 6;

  totalPages = () => {
    const total = this.filteredAnnonces.length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  };

  effectivePage = () => {
    const total = this.totalPages();
    return Math.min(Math.max(1, this.page()), total);
  };

  pages = () => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  };

  pagedAnnonces = () => {
    const list = this.filteredAnnonces;
    const page = this.effectivePage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  };

  goToPage(p: number): void {
    const total = this.totalPages();
    const next = Math.min(Math.max(1, p), total);
    this.page.set(next);
  }

  prevPage(): void {
    this.goToPage(this.page() - 1);
  }

  nextPage(): void {
    this.goToPage(this.page() + 1);
  }

  get categories(): string[] {
    const items = new Set<string>();
    this.annonces.forEach((a) => {
      const value = (a.categorie || '').trim();
      if (value) items.add(value);
    });
    return Array.from(items).sort();
  }

  get pendingServices(): Service[] {
    if (!this.authService.isClient()) return [];
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.services
      .filter((s) => s.client_id === user.id && s.statut === 'choisi')
      .slice()
      .sort((a, b) => (b.idService ?? 0) - (a.idService ?? 0));
  }

  constructor(
    public authService: AuthService,
    private annonceService: AnnonceService,
    private toastService: ToastService,
    private freelancerService: FreelancerService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    // Charge la liste publique (souvent filtrée côté backend)
    this.loadFreelancers();
    this.loadServices();

    // Recharger la liste si un freelancer change / s'inscrit
    this.freelancerService.ratingChanged$.subscribe(() => {
      this.loadFreelancers();
    });
  }

  loadServices(): void {
    this.servicesLoading.set(true);
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.servicesLoading.set(false);
      },
      error: (err) => {
        this.services = [];
        this.servicesLoading.set(false);
        this.toastService.error(
          err?.error?.detail ||
          'Impossible de charger les services'
        );
      }
    });
  }

  get filteredAnnonces(): Annonce[] {
    const annonceQuery = this.annonceQuery.trim().toLowerCase();
    const categorie = this.selectedCategorie.trim().toLowerCase();

    return this.annonces.filter((a) => {
      const annonceMatch =
        !annonceQuery ||
        a.titre?.toLowerCase().includes(annonceQuery) ||
        a.description?.toLowerCase().includes(annonceQuery);

      if (!annonceMatch) return false;

      if (!categorie) return true;
      return (a.categorie || '').toLowerCase() === categorie;
    });
  }

  getAnnonceOrders(annonceId?: number): Service[] {
    if (!annonceId) return [];
    return this.services
      .filter((s) => s.annonce_id === annonceId && s.client_id != null)
      .slice()
      .sort((a, b) => (b.idService ?? 0) - (a.idService ?? 0));
  }

  hasClientOrdered(annonceId?: number): boolean {
    if (!this.authService.isClient()) return false;
    const user = this.authService.currentUser();
    if (!user || !annonceId) return false;
    return this.services.some((s) => s.annonce_id === annonceId && s.client_id === user.id);
  }

  chooseAnnonce(annonce: Annonce): void {
    if (!this.authService.isClient()) {
      this.toastService.warning('Seuls les clients peuvent commander une annonce');
      return;
    }
    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error('Vous devez etre connecte');
      return;
    }
    if (!annonce.idAnnonce) {
      this.toastService.error('Annonce invalide');
      return;
    }
    if (this.hasClientOrdered(annonce.idAnnonce)) {
      this.toastService.info('Vous avez deja commande cette annonce');
      return;
    }

    // Show details + confirmation modal before ordering
    this.annonceToOrder.set(annonce);
    const modalElement = document.getElementById('orderAnnonceModal');
    if (modalElement) {
      this.orderModal = new bootstrap.Modal(modalElement);
      this.orderModal.show();
    }
  }

  confirmOrder(): void {
    if (!this.authService.isClient()) {
      this.toastService.warning('Seuls les clients peuvent commander une annonce');
      return;
    }
    const user = this.authService.currentUser();
    const annonce = this.annonceToOrder();
    if (!user || !annonce?.idAnnonce) {
      this.toastService.error('Commande invalide');
      return;
    }
    if (this.hasClientOrdered(annonce.idAnnonce)) {
      this.toastService.info('Vous avez deja commande cette annonce');
      this.orderModal?.hide();
      return;
    }

    this.submitting.set(true);
    this.serviceService.createService({
      titre: annonce.titre,
      description: annonce.description,
      delai: annonce.delai,
      categorie: annonce.categorie,
      statut: 'choisi',
      freelancer_id: annonce.freelancer_id,
      annonce_id: annonce.idAnnonce,
      client_id: user.id
    }).subscribe({
      next: (created) => {
        this.services = [created, ...this.services];
        this.toastService.success('Commande envoyee au freelancer');
        this.submitting.set(false);
        this.orderModal?.hide();
        this.annonceToOrder.set(null);
        // Refresh from API to keep freelancer view consistent
        this.loadServices();
      },
      error: (err) => {
        this.toastService.error(err?.error?.detail || 'Erreur lors de la commande');
        this.submitting.set(false);
      }
    });
  }

  chooseService(service: Service): void {
    if (!this.authService.isClient()) {
      this.toastService.warning('Seuls les clients peuvent choisir un service');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error('Vous devez etre connecte');
      return;
    }

    if (service.idService == null) {
      this.toastService.error('Service invalide');
      return;
    }
    this.serviceService.chooseService(service.idService, user.id).subscribe({
      next: (updated) => {
        const index = this.services.findIndex((s) => s.idService === updated.idService);
        if (index >= 0) {
          this.services[index] = updated;
        }
        this.toastService.success(`Service "${updated.titre}" choisi`);
      },
      error: (err) => {
        this.toastService.error(err?.error?.detail || 'Erreur lors du choix du service');
      }
    });
  }

  markServiceDone(service: Service): void {
    if (!this.authService.isFreelancer()) {
      this.toastService.warning('Seuls les freelancers peuvent valider un service');
      return;
    }

    if (service.idService == null) {
      this.toastService.error('Service invalide');
      return;
    }

    this.serviceService.markServiceDone(service.idService).subscribe({
      next: (updated) => {
        const index = this.services.findIndex((s) => s.idService === updated.idService);
        if (index >= 0) {
          this.services[index] = updated;
        }
        this.toastService.success('Service marque comme fait');
      },
      error: (err) => {
        this.toastService.error(err?.error?.detail || 'Erreur lors de la mise a jour');
      }
    });
  }

  reportClient(service: Service): void {
    if (!this.authService.isFreelancer()) {
      this.toastService.warning('Seuls les freelancers peuvent signaler un client');
      return;
    }

    if (!service.client_id) {
      this.toastService.error('Aucun client associe a ce service');
      return;
    }

    // Open the same report modal used for reporting freelancers
    this.selectedClientForReport.set(null);
    this.selectedClientForReport.set(service.client_id);
  }

  onClientReportSubmitted(): void {
    this.selectedClientForReport.set(null);
  }

  loadFreelancers(): void {
    this.freelancerService.getFreelancers().subscribe({
      next: (freelancers) => {
        freelancers.forEach(f => {
          const id = Number(f.id);
          const nom = (f.nom ?? '').trim();
          if (!Number.isNaN(id) && nom) {
            this.freelancerNames.set(id, nom);
          }
        });
      },
      error: (err) => console.error('Erreur chargement freelancers:', err)
    });
  }

  getFreelancerName(freelancerId: number): string {
    const id = Number(freelancerId);
    const name = this.freelancerNames.get(id);
    if (name) return name;

    // Fallback: l'endpoint /freelancers est filtré (ex: profil accepté).
    // Pour afficher le nom sur les annonces, on récupère le détail par ID.
    if (!Number.isNaN(id) && !this.freelancerDetailLoading.has(id)) {
      this.freelancerDetailLoading.add(id);
      this.freelancerService.getFreelancerDetail(id).subscribe({
        next: (detail) => {
          const nom = (detail?.nom ?? '').trim();
          if (nom) {
            this.freelancerNames.set(id, nom);
          }
        },
        error: () => {
          this.freelancerDetailLoading.delete(id);
        },
        complete: () => {
          this.freelancerDetailLoading.delete(id);
        }
      });
    }

    return 'Chargement...';
  }

  getImageUrl(imagePath: string | undefined): string {
    return this.annonceService.getImageUrl(imagePath);
  }

  canEditAnnonce(annonce: Annonce): boolean {
    const user = this.authService.currentUser();
    return this.authService.isFreelancer() && user?.id === annonce.freelancer_id;
  }

  openCreateModal(): void {
    this.editingAnnonce.set(null);
    this.formTitre = '';
    this.formCategorie = '';
    this.formDelai = 7;
    this.formDescription = '';
    this.selectedFile = null;
    this.formImageUrl = null;
    this.imagePreview.set(null);
    this.openModal();
  }

  openEditModal(annonce: Annonce): void {
    this.editingAnnonce.set(annonce);
    this.formTitre = annonce.titre;
    this.formCategorie = annonce.categorie;
    this.formDelai = annonce.delai;
    this.formDescription = annonce.description;
    this.formImageUrl = annonce.image || null;
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.openModal();
  }

  private openModal(): void {
    const modalElement = document.getElementById('annonceModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.formImageUrl = null;
    this.imagePreview.set(null);
    // Reset the file input
    const input = document.getElementById('imageInput') as HTMLInputElement;
    if (input) input.value = '';
  }

  confirmDelete(annonce: Annonce): void {
    this.annonceToDelete.set(annonce);
    const modalElement = document.getElementById('deleteAnnonceModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
      this.deleteModal.show();
    }
  }

  async saveAnnonce(): Promise<void> {
    if (!this.formTitre.trim() || !this.formDescription.trim() || !this.formCategorie.trim() || !this.formDelai) {
      this.toastService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting.set(true);

    // Upload image if selected
    let imageUrl = this.formImageUrl;
    if (this.selectedFile) {
      this.uploading.set(true);
      try {
        const response = await this.annonceService.uploadImage(this.selectedFile).toPromise();
        imageUrl = response?.url || null;
      } catch (error: any) {
        this.toastService.error(error?.error?.detail || 'Erreur lors de l\'upload de l\'image');
        this.submitting.set(false);
        this.uploading.set(false);
        return;
      }
      this.uploading.set(false);
    }

    const editing = this.editingAnnonce();

    if (editing && editing.idAnnonce) {
      // Update existing annonce
      this.annonceService.updateAnnonce(editing.idAnnonce, {
        titre: this.formTitre,
        description: this.formDescription,
        categorie: this.formCategorie,
        delai: this.formDelai,
        image: imageUrl || undefined
      }).subscribe({
        next: () => {
          this.modal?.hide();
          this.toastService.success('Annonce modifiee avec succes!');
          this.annonceUpdated.emit();
          this.submitting.set(false);
        },
        error: (err) => {
          this.toastService.error(err?.error?.detail || 'Erreur lors de la modification');
          this.submitting.set(false);
        }
      });
    } else {
      // Create new annonce
      const user = this.authService.currentUser();
      if (!user) {
        this.toastService.error('Vous devez etre connecte');
        this.submitting.set(false);
        return;
      }

      this.annonceService.createAnnonce({
        titre: this.formTitre,
        description: this.formDescription,
        categorie: this.formCategorie,
        delai: this.formDelai,
        image: imageUrl || undefined,
        dateCreation: new Date().toISOString().split('T')[0],
        freelancer_id: user.id
      }).subscribe({
        next: () => {
          this.modal?.hide();
          this.toastService.success('Annonce creee avec succes!');
          this.annonceUpdated.emit();
          this.submitting.set(false);
        },
        error: (err) => {
          this.toastService.error(err?.error?.detail || 'Erreur lors de la creation');
          this.submitting.set(false);
        }
      });
    }
  }

  deleteAnnonce(): void {
    const annonce = this.annonceToDelete();
    if (!annonce?.idAnnonce) return;

    this.submitting.set(true);

    this.annonceService.deleteAnnonce(annonce.idAnnonce).subscribe({
      next: () => {
        this.deleteModal?.hide();
        this.toastService.success('Annonce supprimee!');
        this.annonceUpdated.emit();
        this.submitting.set(false);
      },
      error: (err) => {
        this.toastService.error(err?.error?.detail || 'Erreur lors de la suppression');
        this.submitting.set(false);
      }
    });
  }
}
