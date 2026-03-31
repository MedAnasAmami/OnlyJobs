import { Component, input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreelancerDetail } from '../../models/freelancer.model';
import { Profil } from '../../models/profil.model';
import { FreelancerService } from '../../services/freelancer.service';
import { AuthService } from '../../services/auth.service';

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
}
