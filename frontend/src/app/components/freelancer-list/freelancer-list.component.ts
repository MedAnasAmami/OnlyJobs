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

  // Pagination
  page = signal(1);
  readonly pageSize = 6;

  totalPages = computed(() => {
    const total = this.acceptedFreelancers().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  });

  effectivePage = computed(() => {
    const totalPages = this.totalPages();
    return Math.min(Math.max(1, this.page()), totalPages);
  });

  pagedFreelancers = computed(() => {
    const list = this.acceptedFreelancers();
    const page = this.effectivePage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  viewDetail = output<number>();

  selectedFreelancerForRating = signal<number | null>(null);
  selectedFreelancerForReport = signal<number | null>(null);

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
