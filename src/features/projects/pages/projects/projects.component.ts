import { Component, OnInit, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECT_GALLERY, ProjectItem } from '../../../../app/core/data/company-content';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';

export type CategoryFilter = 'all' | 'piping' | 'structural' | 'tanks' | 'maintenance' | 'insulation' | 'filters';

export interface CategoryTab {
  key: CategoryFilter;
  label: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, WeldSeamDividerComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  activeCategory = signal<CategoryFilter>('all');
  projects = signal<ProjectItem[]>(PROJECT_GALLERY);

  categories: CategoryTab[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'piping', label: 'Piping' },
    { key: 'structural', label: 'Structural' },
    { key: 'tanks', label: 'Storage Tanks' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'insulation', label: 'Insulation' },
    { key: 'filters', label: 'Filters & Vessels' }
  ];

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') {
      return this.projects();
    }
    return this.projects().filter(p => p.category === cat);
  });

  // Lightbox State
  selectedProjectIndex = signal<number | null>(null);

  selectedProject = computed(() => {
    const idx = this.selectedProjectIndex();
    if (idx === null) return null;
    const list = this.filteredProjects();
    return list[idx] || null;
  });

  ngOnInit(): void {
    // Default project gallery loaded from company content
  }

  setCategory(cat: CategoryFilter): void {
    this.activeCategory.set(cat);
    this.selectedProjectIndex.set(null);
  }

  openLightbox(index: number): void {
    this.selectedProjectIndex.set(index);
  }

  closeLightbox(): void {
    this.selectedProjectIndex.set(null);
  }

  nextProject(): void {
    const idx = this.selectedProjectIndex();
    if (idx === null) return;
    const max = this.filteredProjects().length;
    this.selectedProjectIndex.set((idx + 1) % max);
  }

  prevProject(): void {
    const idx = this.selectedProjectIndex();
    if (idx === null) return;
    const max = this.filteredProjects().length;
    this.selectedProjectIndex.set((idx - 1 + max) % max);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.selectedProjectIndex() === null) return;
    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextProject();
    } else if (event.key === 'ArrowLeft') {
      this.prevProject();
    }
  }
}
