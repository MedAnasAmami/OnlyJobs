import { Component, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FreelancerService } from '../../services/freelancer.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ReportReason } from '../../models/report.model';

declare var bootstrap: any;

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report-modal.component.html',
  styleUrl: './report-modal.component.css'
})
export class ReportModalComponent implements OnChanges {
  freelancerId = input<number | null>(null);
  clientId = input<number | null>(null);
  reportSubmitted = output<void>();

  selectedReason = signal<ReportReason | ''>('');
  description = signal('');
  submitting = signal(false);

  private modal: any;

  reasons: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Spam ou publicite' },
    { value: 'comportement', label: 'Comportement inapproprie' },
    { value: 'fraude', label: 'Fraude ou arnaque' },
    { value: 'contenu_inapproprie', label: 'Contenu inapproprie' },
    { value: 'autre', label: 'Autre' }
  ];

  constructor(
    private freelancerService: FreelancerService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const hasFreelancerTarget = !!this.freelancerId();
    const hasClientTarget = !!this.clientId();

    // Open modal when either target is set
    if ((changes['freelancerId'] || changes['clientId']) && (hasFreelancerTarget || hasClientTarget)) {
      this.resetForm();
      this.openModal();
    }
  }

  get targetTitle(): string {
    return this.clientId() ? 'Client' : 'Freelancer';
  }

  private resetForm(): void {
    this.selectedReason.set('');
    this.description.set('');
  }

  private openModal(): void {
    const modalElement = document.getElementById('reportModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  async submitReport(): Promise<void> {
    const reason = this.selectedReason();
    if (!reason) {
      this.toastService.warning('Veuillez selectionner une raison');
      return;
    }

    const user = this.authService.currentUser();
    const freelancerId = this.freelancerId();
    const clientId = this.clientId();

    if (!user || (!freelancerId && !clientId) || (freelancerId && clientId)) {
      this.toastService.error('Erreur: utilisateur non connecte');
      return;
    }

    this.submitting.set(true);

    try {
      await this.freelancerService.createReport({
        raison: reason,
        description: this.description() || undefined,
        freelancer_id: freelancerId || undefined,
        client_id: clientId || undefined,
        reporter_id: user.id
      }).toPromise();

      if (this.modal) {
        this.modal.hide();
      }
      this.toastService.success('Votre signalement a ete envoye!');
      this.reportSubmitted.emit();
    } catch (error: any) {
      const message = error?.error?.detail || 'Erreur lors de l\'envoi';
      this.toastService.error(message);
    } finally {
      this.submitting.set(false);
    }
  }
}
