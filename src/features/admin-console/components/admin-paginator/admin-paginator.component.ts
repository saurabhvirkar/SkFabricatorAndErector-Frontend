import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-paginator.component.html',
  styleUrls: ['./admin-paginator.component.scss']
})
export class AdminPaginatorComponent {
  @Input() page = 1;
  @Output() pageChange = new EventEmitter<number>();

  @Input() pageSize = 10;
  @Output() pageSizeChange = new EventEmitter<number>();

  @Input() collectionSize = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];

  get startIndex(): number {
    if (this.collectionSize === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.page * this.pageSize, this.collectionSize);
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.pageChange.emit(this.page);
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.page = 1;
    this.pageSizeChange.emit(this.pageSize);
    this.pageChange.emit(this.page);
  }
}
