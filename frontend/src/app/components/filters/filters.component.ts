import { Component, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterValues {
  disponible: string;
  minTarif: number | null;
  maxTarif: number | null;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  disponible = model('');
  minTarif = model<number | null>(null);
  maxTarif = model<number | null>(null);

  filterChanged = output<FilterValues>();
  reset = output<void>();

  onFilterChange(): void {
    this.filterChanged.emit({
      disponible: this.disponible(),
      minTarif: this.minTarif(),
      maxTarif: this.maxTarif()
    });
  }

  onReset(): void {
    this.disponible.set('');
    this.minTarif.set(null);
    this.maxTarif.set(null);
    this.reset.emit();
  }
}
