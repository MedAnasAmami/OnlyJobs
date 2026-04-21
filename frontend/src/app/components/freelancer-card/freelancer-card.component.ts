import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FreelancerDetail } from '../../models/freelancer.model';
import { AuthService } from '../../services/auth.service';
import { FreelancerService, AverageRating } from '../../services/freelancer.service';
import { ToastService } from '../../services/toast.service';

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

  constructor(
    public authService: AuthService,
    private freelancerService: FreelancerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAverageRating();
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
