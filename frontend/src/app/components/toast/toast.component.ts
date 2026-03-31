import { Component } from '@angular/core';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getBgClass(type: Toast['type']): string {
    const classes: Record<Toast['type'], string> = {
      success: 'bg-success',
      danger: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    return classes[type] || 'bg-info';
  }

  getIconClass(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      success: 'bi-check-circle-fill',
      danger: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
