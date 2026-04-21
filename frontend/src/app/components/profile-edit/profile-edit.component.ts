import { Component, signal, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfilService } from '../../services/profil.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Profil, ProfilUpdate } from '../../models/profil.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  profil = signal<Profil | null>(null);
  loading = signal(false);
  saving = signal(false);

  // Form fields - as regular properties for two-way binding
  description = '';
  competences = '';
  experience = '';
  photo: File | null = null;
  photoPreview: string | null = null;

  // Output event to navigate back
  sectionChanged = output<string>();

  constructor(
    private profilService: ProfilService,
    public authService: AuthService,
    private toastService: ToastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      this.toastService.error('Veuillez vous connecter comme freelancer');
      this.sectionChanged.emit('freelancers');
      return;
    }

    if (!this.authService.isFreelancer()) {
      this.toastService.error('Seuls les freelancers peuvent accéder à cette page');
      this.sectionChanged.emit('freelancers');
      return;
    }

    this.loadProfile(userId);
  }

  loadProfile(freelancerId: number): void {
    this.loading.set(true);
    this.profilService.getProfilByFreelancer(freelancerId).subscribe({
      next: (data) => {
        this.profil.set(data);
        this.description = data.description || '';
        this.competences = data.competences || '';
        this.experience = data.experience || '';
        if (data.photo) {
          this.photoPreview = data.photo;
        }
        this.loading.set(false);
      },
      error: (err) => {
        // If profile doesn't exist, create an empty one
        if (err.status === 404) {
          this.createEmptyProfile(freelancerId);
        } else {
          this.toastService.error('Erreur lors du chargement du profil');
          this.loading.set(false);
        }
      }
    });
  }

  createEmptyProfile(freelancerId: number): void {
    const newProfil = {
      photo: null,
      description: '',
      competences: '',
      experience: '',
      freelancer_id: freelancerId
    };

    this.profilService.createProfil(newProfil).subscribe({
      next: (data) => {
        this.profil.set(data);
        this.loading.set(false);
        this.toastService.success('Profil créé, commencez à remplir les informations');
      },
      error: () => {
        this.toastService.error('Erreur lors de la création du profil');
        this.loading.set(false);
      }
    });
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.photo = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    const profil = this.profil();
    if (!profil || !profil.idProfil) {
      this.toastService.error('Profil non trouvé');
      return;
    }

    this.saving.set(true);

    // If file is selected, upload it first
    if (this.photo) {
      const formData = new FormData();
      formData.append('file', this.photo);

      this.http.post<{ url: string }>(`${environment.apiUrl}/upload`, formData).subscribe({
        next: (response) => {
          this.saveProfileData(profil.idProfil!, response.url);
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Erreur lors de l\'upload de la photo');
        }
      });
    } else {
      this.saveProfileData(profil.idProfil, this.photoPreview || undefined);
    }
  }

  private saveProfileData(profilId: number, photoUrl?: string): void {
    const updateData: ProfilUpdate = {
      description: this.description,
      competences: this.competences,
      experience: this.experience,
      photo: photoUrl
    };

    this.profilService.updateProfil(profilId, updateData).subscribe({
      next: (data) => {
        this.profil.set(data);
        this.photo = null;
        this.saving.set(false);
        this.toastService.success('Profil mis à jour avec succès!');
      },
      error: () => {
        this.saving.set(false);
        this.toastService.error('Erreur lors de la mise à jour du profil');
      }
    });
  }

  cancel(): void {
    this.sectionChanged.emit('freelancers');
  }
}
