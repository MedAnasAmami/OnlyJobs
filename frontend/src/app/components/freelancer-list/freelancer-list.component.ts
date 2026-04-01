import { Component, input, output, signal } from '@angular/core';
import { Freelancer } from '../../models/freelancer.model';
import { FreelancerCardComponent } from '../freelancer-card/freelancer-card.component';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';
import { ReportModalComponent } from '../report-modal/report-modal.component';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [FreelancerCardComponent, RatingModalComponent, ReportModalComponent],
  templateUrl: './freelancer-list.component.html',
  styleUrl: './freelancer-list.component.css'
})
export class FreelancerListComponent {
  freelancers = input<Freelancer[]>([]);
  loading = input(false);

  viewDetail = output<number>();

  selectedFreelancerForRating = signal<number | null>(null);
  selectedFreelancerForReport = signal<number | null>(null);

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }

  onRateFreelancer(id: number): void {
    this.selectedFreelancerForRating.set(id);
  }

  onReportFreelancer(id: number): void {
    this.selectedFreelancerForReport.set(id);
  }

  onRatingSubmitted(): void {
    this.selectedFreelancerForRating.set(null);
  }

  onReportSubmitted(): void {
    this.selectedFreelancerForReport.set(null);
  }
}
