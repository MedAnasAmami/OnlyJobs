import { Component, input, output, signal, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FreelancerDetail } from '../../models/freelancer.model';
import { AuthService } from '../../services/auth.service';
import { FreelancerService, AverageRating } from '../../services/freelancer.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-freelancer-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './freelancer-card.component.html',
  styleUrl: './freelancer-card.component.css'
})
export class FreelancerCardComponent implements OnInit {
  freelancer = input.required<FreelancerDetail>();
  index = input(0);

  viewDetail = output<number>();
  rateFreelancer = output<number>();
  reportFreelancer = output<number>();

  averageRating = signal<AverageRating>({ average: 0, count: 0 });
  private readonly destroyRef = inject(DestroyRef);

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
    public authService: AuthService,
    private freelancerService: FreelancerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAverageRating();

    this.freelancerService.ratingChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((freelancerId) => {
        if (freelancerId === this.freelancer().id) {
          this.loadAverageRating();
        }
      });
  }

  loadAverageRating(): void {
    this.freelancerService.getFreelancerAverageRating(this.freelancer().id).subscribe({
      next: (data) => this.averageRating.set(data),
      error: () => this.averageRating.set({ average: 0, count: 0 })
    });
  }

  get statusClass(): string {
    return this.freelancer().status === 'actif' ? 'text-success' : 'text-secondary';
  }

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getStarClass(star: number): string {
    const avg = this.averageRating().average;
    if (star <= Math.floor(avg)) {
      return 'bi-star-fill';
    } else if (star === Math.ceil(avg) && avg % 1 >= 0.5) {
      return 'bi-star-half';
    }
    return 'bi-star';
  }

  photoUrl(): string {
    const photo = this.freelancer().profil?.photo;
    if (!photo) {
      return this.placeholderImg;
    }

    // Data URL (base64)
    if (photo.startsWith('data:')) {
      return photo;
    }

    // Already absolute
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }

    // Normalize leading slash
    if (photo.startsWith('/')) {
      return `${environment.apiUrl}${photo}`;
    }

    // Handle stored paths like "uploads/xxx.jpg"
    if (photo.startsWith('uploads/')) {
      return `${environment.apiUrl}/${photo}`;
    }

    return `${environment.apiUrl}/uploads/${photo}`;
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImg;
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.freelancer().id);
  }

  onRate(): void {
    if (!this.authService.isClient()) {
      this.toastService.warning('Seuls les clients peuvent noter les freelancers');
      return;
    }
    this.rateFreelancer.emit(this.freelancer().id);
  }

  onReport(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.warning('Connectez-vous pour signaler un freelancer');
      return;
    }
    this.reportFreelancer.emit(this.freelancer().id);
  }
}
