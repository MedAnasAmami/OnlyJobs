import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {
  nom = signal('');
  email = signal('');
  motDePasse = signal('');
  telephone = signal('');
  role = signal<'client' | 'freelancer'>('client');
  error = signal('');
  success = signal('');
  submitting = signal(false);

  openLogin = output<void>();

  private modal: any;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  open(): void {
    this.resetForm();
    const modalElement = document.getElementById('registerModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  private resetForm(): void {
    this.nom.set('');
    this.email.set('');
    this.motDePasse.set('');
    this.telephone.set('');
    this.role.set('client');
    this.error.set('');
    this.success.set('');
  }

  async register(): Promise<void> {
    this.submitting.set(true);
    this.error.set('');
    this.success.set('');

    try {
      await this.authService.register({
        nom: this.nom(),
        email: this.email(),
        motDePasse: this.motDePasse(),
        telephone: this.telephone(),
        role: this.role()
      }).toPromise();

      if (this.modal) {
        this.modal.hide();
      }

      const user = this.authService.currentUser();
      this.toastService.success(`Bienvenue ${user?.nom}! Inscription reussie.`);
      this.openLogin.emit();
    } catch (err: any) {
      const message = err?.error?.detail || 'Erreur d\'inscription';
      this.error.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}
