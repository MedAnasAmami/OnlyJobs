import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  email = signal('');
  motDePasse = signal('');
  error = signal('');
  submitting = signal(false);

  loginSuccess = output<void>();

  private modal: any;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  open(): void {
    this.resetForm();
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  private resetForm(): void {
    this.email.set('');
    this.motDePasse.set('');
    this.error.set('');
  }

  async login(): Promise<void> {
    this.submitting.set(true);
    this.error.set('');

    try {
      await this.authService.login({
        email: this.email(),
        motDePasse: this.motDePasse()
      }).toPromise();

      if (this.modal) {
        this.modal.hide();
      }

      const user = this.authService.currentUser();
      this.toastService.success(`Bienvenue ${user?.nom}!`);
      this.loginSuccess.emit();
    } catch (err: any) {
      const message = err?.error?.detail || 'Erreur de connexion';
      this.error.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}
