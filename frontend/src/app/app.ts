import { Component, signal, ViewChild, computed } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FreelancerListComponent } from './components/freelancer-list/freelancer-list.component';
import { FreelancerModalComponent } from './components/freelancer-modal/freelancer-modal.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { StatsComponent } from './components/stats/stats.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { AnnonceListComponent } from './components/annonce-list/annonce-list.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { FreelancerService } from './services/freelancer.service';
import { AnnonceService } from './services/annonce.service';
import { FreelancerDetail } from './models/freelancer.model';
import { Annonce } from './models/annonce.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FreelancerListComponent,
    FreelancerModalComponent,
    LoginModalComponent,
    RegisterModalComponent,
    StatsComponent,
    FooterComponent,
    ToastComponent,
    AnnonceListComponent,
    ProfileEditComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(LoginModalComponent) loginModal!: LoginModalComponent;
  @ViewChild(RegisterModalComponent) registerModal!: RegisterModalComponent;

  currentSection = signal('freelancers');
  freelancers = signal<FreelancerDetail[]>([]);
  annonces = signal<Annonce[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  selectedFreelancerId = signal<number | null>(null);

  // Filtered freelancers based on search query
  filteredFreelancers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allFreelancers = this.freelancers();

    if (!query) {
      return allFreelancers;
    }

    return allFreelancers.filter(f =>
      f.id.toString().includes(query) ||
      f.status?.toLowerCase().includes(query) ||
      f.nom?.toLowerCase().includes(query) ||
      f.email?.toLowerCase().includes(query)
    );
  });

  // Filtered annonces based on search query
  filteredAnnonces = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allAnnonces = this.annonces();

    if (!query) {
      return allAnnonces;
    }

    return allAnnonces.filter(a =>
      a.titre?.toLowerCase().includes(query) ||
      a.description?.toLowerCase().includes(query)
    );
  });

  constructor(
    private freelancerService: FreelancerService,
    private annonceService: AnnonceService
  ) {
    this.loadFreelancers();
    this.loadAnnonces();
  }

  loadFreelancers(): void {
    this.loading.set(true);
    this.freelancerService.getFreelancers().subscribe({
      next: (data) => {
        this.freelancers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadAnnonces(): void {
    this.annonceService.getAnnonces().subscribe({
      next: (data) => {
        this.annonces.set(data);
      },
      error: () => {}
    });
  }

  onSectionChanged(section: string): void {
    this.currentSection.set(section);
  }

  onSearchChanged(query: string): void {
    this.searchQuery.set(query);
  }

  onViewDetail(id: number): void {
    this.selectedFreelancerId.set(id);
  }

  openLoginModal(): void {
    this.loginModal.open();
  }

  openRegisterModal(): void {
    this.registerModal.open();
  }

  onLoginSuccess(): void {
    this.loadFreelancers();
    this.loadAnnonces();
  }
}
