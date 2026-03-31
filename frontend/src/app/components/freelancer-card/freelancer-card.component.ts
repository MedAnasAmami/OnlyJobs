import { Component, input, output } from '@angular/core';
import { Freelancer } from '../../models/freelancer.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-freelancer-card',
  standalone: true,
  templateUrl: './freelancer-card.component.html',
  styleUrl: './freelancer-card.component.css'
})
export class FreelancerCardComponent {
  freelancer = input.required<Freelancer>();
  index = input(0);

  viewDetail = output<number>();

  constructor(public authService: AuthService) {}

  get statusClass(): string {
    return this.freelancer().status === 'actif' ? 'text-success' : 'text-secondary';
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.freelancer().id);
  }
}
