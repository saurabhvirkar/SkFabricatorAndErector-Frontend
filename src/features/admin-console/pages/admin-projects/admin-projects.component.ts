import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../projects/services/project.service';
import { Project } from '../../../projects/models/project.model';
import { ProjectDialogComponent } from './project-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    MatSnackBarModule,
    MatIconModule,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    AdminPageHeaderComponent,
    AdminPaginatorComponent
  ],
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  projects = signal<Project[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  filterText = signal('');
  sortColumn = signal<string>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');

  page = signal(1);
  pageSize = signal(5);

  filteredProjects = computed(() => {
    let result = [...this.projects()];
    const query = this.filterText().trim().toLowerCase();

    if (query) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    const col = this.sortColumn();
    const dir = this.sortDirection();

    if (col) {
      result.sort((a, b) => {
        let valA = (a as any)[col] ?? '';
        let valB = (b as any)[col] ?? '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  paginatedProjects = computed(() => {
    const list = this.filteredProjects();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  onSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
    this.page.set(1);
  }

  openAddDialog(): void {
    const modalRef = this.modalService.open(ProjectDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.projectService.addProject(formData).subscribe({
          next: () => {
            this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
            this.loadProjects();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to create project', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  openEditDialog(project: Project): void {
    const modalRef = this.modalService.open(ProjectDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.project = project;

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.projectService.updateProject(project.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
            this.loadProjects();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to update project', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  deleteProject(project: Project): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Project';
    modalRef.componentInstance.message = `Are you sure you want to delete "${project.title}"? This operation cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed) {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            this.snackBar.open('Project deleted successfully', 'Close', { duration: 3000 });
            this.loadProjects();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete project', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
