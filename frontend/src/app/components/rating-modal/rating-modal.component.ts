import { Component, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FreelancerService } from '../../services/freelancer.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rating-modal.component.html',
  styleUrl: './rating-modal.component.css'
})
export class RatingModalComponent implements OnChanges {
  freelancerId = input<number | null>(null);
  ratingSubmitted = output<void>();

  selectedRating = signal(0);
  hoveredRating = signal(0);
  comment = signal('');
  submitting = signal(false);

  private modal: any;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private freelancerService: FreelancerService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['freelancerId'] && this.freelancerId()) {
      this.resetForm();
      this.openModal();
    }
  }

  private resetForm(): void {
    this.selectedRating.set(0);
    this.hoveredRating.set(0);
    this.comment.set('');
  }

  private openModal(): void {
    const modalElement = document.getElementById('ratingModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  selectRating(rating: number): void {
    this.selectedRating.set(rating);
  }

  hoverRating(rating: number): void {
    this.hoveredRating.set(rating);
  }

  leaveHover(): void {
    this.hoveredRating.set(0);
  }

  isStarActive(star: number): boolean {
    const hovered = this.hoveredRating();
    const selected = this.selectedRating();
    return star <= (hovered || selected);
  }

  async submitRating(): Promise<void> {
    const rating = this.selectedRating();
    if (rating === 0) {
      this.toastService.warning('Veuillez selectionner une note');
      return;
    }

    const user = this.authService.currentUser();
    const freelancerId = this.freelancerId();

    if (!user || !freelancerId) {
      this.toastService.error('Erreur: utilisateur non connecte');
      return;
    }

    this.submitting.set(true);

    try {
      await this.freelancerService.createRating({
        note: rating,
        commentaire: this.comment(),
        freelancer_id: freelancerId,
        client_id: user.id
      }).toPromise();

      if (this.modal) {
        this.modal.hide();
      }
      this.toastService.success('Votre avis a ete enregistre!');
      this.ratingSubmitted.emit();
    } catch (error: any) {
      const message = error?.error?.detail || 'Erreur lors de l\'envoi';
      this.toastService.error(message);
    } finally {
      this.submitting.set(false);
    }
  }
}
