import { Component, output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  activeSection = 'freelancers';

  sectionChanged = output<string>();
  openLogin = output<void>();
  openRegister = output<void>();

  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  changeSection(section: string): void {
    this.activeSection = section;
    this.sectionChanged.emit(section);
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Vous etes deconnecte');
  }
}
