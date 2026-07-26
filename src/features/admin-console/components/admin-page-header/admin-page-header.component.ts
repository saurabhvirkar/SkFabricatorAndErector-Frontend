import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './admin-page-header.component.html',
  styleUrls: ['./admin-page-header.component.scss']
})
export class AdminPageHeaderComponent {
  @Input() title = '';
  @Input() breadcrumb = '';
  @Input() icon = 'dashboard';
  @Input() description?: string;
  @Input() primaryActionLabel?: string;
  @Input() primaryActionIcon = 'add';

  @Output() primaryAction = new EventEmitter<void>();

  onPrimaryClick(): void {
    this.primaryAction.emit();
  }
}
