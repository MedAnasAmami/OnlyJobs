import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Annonce } from '../../models/annonce.model';
import { AnnonceService } from '../../services/annonce.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

      @if (annonces.length === 0) {
        <div class="text-center py-5">
          <i class="bi bi-megaphone display-1 text-muted"></i>
          <p class="mt-3 text-muted">Aucune annonce disponible</p>
        </div>
      } @else {
        <div class="annonces-grid">
          @for (annonce of annonces; track annonce.idAnnonce) {
            <div class="annonce-card">
              @if (annonce.image) {
                <div class="annonce-image">
                  <img [src]="getImageUrl(annonce.image)" [alt]="annonce.titre">
                </div>
              }
              <div class="annonce-content">
                <div class="d-flex justify-content-between align-items-start">
                  <h3>{{ annonce.titre }}</h3>
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
                <p>{{ annonce.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="date"><i class="bi bi-calendar me-1"></i>{{ annonce.dateCreation }}</span>
                  <span class="badge bg-primary">Freelancer #{{ annonce.freelancer_id }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

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
export class AnnonceListComponent {
  @Input() annonces: Annonce[] = [];
  @Output() annonceUpdated = new EventEmitter<void>();

  editingAnnonce = signal<Annonce | null>(null);
  annonceToDelete = signal<Annonce | null>(null);
  submitting = signal(false);
  uploading = signal(false);
  imagePreview = signal<string | null>(null);

  formTitre = '';
  formDescription = '';
  selectedFile: File | null = null;
  formImageUrl: string | null = null;

  private modal: any;
  private deleteModal: any;

  constructor(
    public authService: AuthService,
    private annonceService: AnnonceService,
    private toastService: ToastService
  ) {}

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
    this.formDescription = '';
    this.selectedFile = null;
    this.formImageUrl = null;
    this.imagePreview.set(null);
    this.openModal();
  }

  openEditModal(annonce: Annonce): void {
    this.editingAnnonce.set(annonce);
    this.formTitre = annonce.titre;
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
    if (!this.formTitre.trim() || !this.formDescription.trim()) {
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
