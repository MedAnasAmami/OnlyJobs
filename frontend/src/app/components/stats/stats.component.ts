import { Component, OnInit, signal } from '@angular/core';
import { FreelancerService, Stats } from '../../services/freelancer.service';
import { ToastService } from '../../services/toast.service';

interface StatCard {
  icon: string;
  color: string;
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  loading = signal(true);
  statsCards = signal<StatCard[]>([]);

  constructor(
    private freelancerService: FreelancerService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);

    this.freelancerService.getStats().subscribe({
      next: (stats: Stats) => {
        this.statsCards.set([
          { icon: 'bi-people-fill', color: 'primary', value: stats.total_utilisateurs, label: 'Utilisateurs' },
          { icon: 'bi-person-badge-fill', color: 'success', value: stats.total_freelancers, label: 'Freelancers' },
          { icon: 'bi-briefcase-fill', color: 'info', value: stats.total_clients, label: 'Clients' },
          { icon: 'bi-megaphone-fill', color: 'warning', value: stats.total_annonces, label: 'Annonces' }
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Erreur lors du chargement des statistiques');
        this.loading.set(false);
      }
    });
  }
}
