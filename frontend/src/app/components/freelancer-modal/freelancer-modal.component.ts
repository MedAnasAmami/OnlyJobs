import { Component, input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreelancerDetail } from '../../models/freelancer.model';
import { FreelancerService } from '../../services/freelancer.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-freelancer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './freelancer-modal.component.html',
  styleUrl: './freelancer-modal.component.css'
})
export class FreelancerModalComponent implements OnChanges {
  freelancerId = input<number | null>(null);

  freelancer = signal<FreelancerDetail | null>(null);
  loading = signal(false);

  private modal: any;

  private readonly placeholderImg =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
         <rect width="100%" height="100%" fill="#f1f3f5"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="28">
           No image
         </text>
       </svg>`
    );

  constructor(
    private freelancerService: FreelancerService,
    public authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['freelancerId'] && this.freelancerId()) {
      this.loadFreelancerDetail();
    }
  }

  private loadFreelancerDetail(): void {
    const id = this.freelancerId();
    if (!id) return;

    this.loading.set(true);

    this.freelancerService.getFreelancerDetail(id).subscribe({
      next: (data) => {
        this.freelancer.set(data);
        this.loading.set(false);
        this.openModal();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private openModal(): void {
    const modalElement = document.getElementById('freelancerModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  get competences(): string[] {
    const profil = this.freelancer()?.profil;
    return profil?.competences ? profil.competences.split(',').map(c => c.trim()) : [];
  }

  photoUrl(photo?: string): string {
    if (!photo) return this.placeholderImg;

    // Data URL (base64)
    if (photo.startsWith('data:')) return photo;

    // Already absolute
    if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;

    // Normalize leading slash
    if (photo.startsWith('/')) return `${environment.apiUrl}${photo}`;

    // Handle stored paths like "uploads/xxx.jpg"
    if (photo.startsWith('uploads/')) return `${environment.apiUrl}/${photo}`;

    return `${environment.apiUrl}/uploads/${photo}`;
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImg;
  }
}
