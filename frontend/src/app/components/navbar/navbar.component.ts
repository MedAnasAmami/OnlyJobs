import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  activeSection = 'freelancers';
  searchQuery = '';

  sectionChanged = output<string>();
  openLogin = output<void>();
  openRegister = output<void>();
  searchChanged = output<string>();

  constructor(
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  changeSection(section: string): void {
    this.activeSection = section;
    this.sectionChanged.emit(section);
  }

  onSearch(): void {
    this.searchChanged.emit(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChanged.emit('');
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Vous etes deconnecte');
  }
}
