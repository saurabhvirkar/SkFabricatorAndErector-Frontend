import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageImageService, PageImageSlotDto } from '../../../../app/core/services/page-image.service';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

export type PageTab = 'All' | 'Home' | 'Services' | 'Projects' | 'About' | 'Contact';

@Component({
  selector: 'app-admin-photo-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    AdminPageHeaderComponent,
    LoadingStateComponent
  ],
  templateUrl: './admin-photo-manager.component.html',
  styleUrls: ['./admin-photo-manager.component.scss']
})
export class AdminPhotoManagerComponent implements OnInit {
  private readonly pageImageService = inject(PageImageService);
  private readonly snackBar = inject(MatSnackBar);

  slots = signal<PageImageSlotDto[]>([]);
  isLoading = signal(true);
  uploadingSlotKey = signal<string | null>(null);

  activeTab = signal<PageTab>('All');
  filterQuery = signal('');

  pages: PageTab[] = ['All', 'Home', 'Services', 'Projects', 'About', 'Contact'];

  filteredSlots = computed(() => {
    let result = this.slots();
    const tab = this.activeTab();
    const query = this.filterQuery().toLowerCase().trim();

    if (tab !== 'All') {
      result = result.filter(s => s.pageName.toLowerCase() === tab.toLowerCase());
    }

    if (query) {
      result = result.filter(s =>
        s.label.toLowerCase().includes(query) ||
        s.slotKey.toLowerCase().includes(query) ||
        s.sectionName.toLowerCase().includes(query)
      );
    }

    return result;
  });

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots(): void {
    this.isLoading.set(true);
    this.pageImageService.loadAllSlots().subscribe({
      next: (data) => {
        this.slots.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackBar.open('Failed to load page image slots', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: PageTab): void {
    this.activeTab.set(tab);
  }

  onFileSelected(event: Event, slot: PageImageSlotDto): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadingSlotKey.set(slot.slotKey);

      this.pageImageService.uploadSlotImage(slot.slotKey, file, slot.altText).subscribe({
        next: (updatedSlot) => {
          this.snackBar.open(`Photo updated for "${slot.label}"!`, 'Close', { duration: 3000 });
          this.uploadingSlotKey.set(null);
          this.loadSlots();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to upload image.', 'Close', { duration: 4000 });
          this.uploadingSlotKey.set(null);
        }
      });
    }
  }

  deleteImage(slot: PageImageSlotDto): void {
    if (confirm(`Remove custom image for "${slot.label}"? It will revert to the default placeholder.`)) {
      this.uploadingSlotKey.set(slot.slotKey);
      this.pageImageService.deleteSlotImage(slot.slotKey).subscribe({
        next: () => {
          this.snackBar.open(`Image removed for "${slot.label}"`, 'Close', { duration: 3000 });
          this.uploadingSlotKey.set(null);
          this.loadSlots();
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Failed to delete image.', 'Close', { duration: 4000 });
          this.uploadingSlotKey.set(null);
        }
      });
    }
  }
}
