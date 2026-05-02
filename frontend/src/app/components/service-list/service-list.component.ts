import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../models/service.model';
import { AuthService } from '../../services/auth.service';
import { ServiceService } from '../../services/service.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServiceListComponent {
  @Input() services: Service[] = [];
  @Input() loading = false;

  selectedCategorie = signal('');
  searchQuery = signal('');

  categories = computed(() => {
    const items = new Set<string>();
    this.services.forEach((s) => {
      const value = (s.categorie || '').trim();
      if (value) items.add(value);
    });
    return Array.from(items).sort();
  });

  filteredServices = computed(() => {
    const categorie = this.selectedCategorie().trim().toLowerCase();
    const query = this.searchQuery().trim().toLowerCase();

    return this.services.filter((s) => {
      if (categorie && (s.categorie || '').toLowerCase() !== categorie) return false;
      if (!query) return true;
      const titre = (s.titre || '').toLowerCase();
      const desc = (s.description || '').toLowerCase();
      return titre.includes(query) || desc.includes(query);
    });
  });

  constructor(
    public authService: AuthService,
    private serviceService: ServiceService,
    private toastService: ToastService
  ) {}

  chooseService(service: Service): void {
    if (!this.authService.isClient()) {
      this.toastService.warning('Seuls les clients peuvent choisir un service');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.toastService.error('Vous devez etre connecte');
      return;
    }

    if (service.idService == null) {
      this.toastService.error('Service invalide');
      return;
    }

    this.serviceService.chooseService(service.idService, user.id).subscribe({
      next: (updated) => {
        const index = this.services.findIndex((s) => s.idService === updated.idService);
        if (index >= 0) {
          this.services[index] = updated;
        }
        this.toastService.success(`Service "${updated.titre}" choisi`);
      },
      error: (err) => {
        this.toastService.error(err?.error?.detail || 'Erreur lors du choix du service');
      }
    });
  }
}
