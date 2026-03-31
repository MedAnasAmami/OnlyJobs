import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Annonce } from '../../models/annonce.model';

@Component({
  selector: 'app-annonce-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="annonces-container">
      <h2>Annonces</h2>
      @if (annonces.length === 0) {
        <p class="no-annonces">Aucune annonce disponible</p>
      } @else {
        <div class="annonces-grid">
          @for (annonce of annonces; track annonce.idAnnonce) {
            <div class="annonce-card">
              <h3>{{ annonce.titre }}</h3>
              <p>{{ annonce.description }}</p>
              <span class="date">{{ annonce.dateCreation }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .annonces-container {
      padding: 20px;
    }
    .annonces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .annonce-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .annonce-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .annonce-card p {
      color: #666;
      margin: 0 0 10px 0;
    }
    .date {
      color: #999;
      font-size: 0.9em;
    }
    .no-annonces {
      text-align: center;
      color: #666;
    }
  `]
})
export class AnnonceListComponent {
  @Input() annonces: Annonce[] = [];
}
