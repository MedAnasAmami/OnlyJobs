import { Component, input, output, signal, computed } from '@angular/core';
import { FreelancerDetail } from '../../models/freelancer.model';
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
  freelancers = input<FreelancerDetail[]>([]);
  loading = input(false);

  // Filtrer pour n'afficher que les profils acceptés dans la liste des cartes
  acceptedFreelancers = computed(() => 
    this.freelancers().filter(f => f.profil?.statut === 'accepte')
  );

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
