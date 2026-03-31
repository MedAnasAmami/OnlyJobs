import { Component, input, output } from '@angular/core';
import { Freelancer } from '../../models/freelancer.model';
import { FreelancerCardComponent } from '../freelancer-card/freelancer-card.component';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [FreelancerCardComponent],
  templateUrl: './freelancer-list.component.html',
  styleUrl: './freelancer-list.component.css'
})
export class FreelancerListComponent {
  freelancers = input<Freelancer[]>([]);
  loading = input(false);

  viewDetail = output<number>();

  onViewDetail(id: number): void {
    this.viewDetail.emit(id);
  }
}
