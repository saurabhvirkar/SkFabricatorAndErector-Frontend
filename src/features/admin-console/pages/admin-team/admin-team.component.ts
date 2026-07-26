import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TeamService } from '../../../team/services/team.service';
import { TeamMember } from '../../../team/models/team-member.model';
import { TeamDialogComponent } from './team-dialog.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AdminPageHeaderComponent } from '../../components/admin-page-header/admin-page-header.component';
import { AdminPaginatorComponent } from '../../components/admin-paginator/admin-paginator.component';

@Component({
  selector: 'app-admin-team',
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
  templateUrl: './admin-team.component.html',
  styleUrls: ['./admin-team.component.scss']
})
export class AdminTeamComponent implements OnInit {
  private readonly teamService = inject(TeamService);
  private readonly modalService = inject(NgbModal);
  private readonly snackBar = inject(MatSnackBar);

  teamMembers = signal<TeamMember[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  filterText = signal('');
  sortColumn = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  page = signal(1);
  pageSize = signal(5);

  filteredTeam = computed(() => {
    let result = [...this.teamMembers()];
    const query = this.filterText().trim().toLowerCase();

    if (query) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        (m.email && m.email.toLowerCase().includes(query))
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

  paginatedTeam = computed(() => {
    const list = this.filteredTeam();
    const start = (this.page() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.loadTeam();
  }

  loadTeam(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.teamService.getTeamMembers().subscribe({
      next: (data) => {
        this.teamMembers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching team members:', err);
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
    const modalRef = this.modalService.open(TeamDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.teamService.addTeamMember(formData).subscribe({
          next: () => {
            this.snackBar.open('Team member created successfully', 'Close', { duration: 3000 });
            this.loadTeam();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to create team member', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  openEditDialog(member: TeamMember): void {
    const modalRef = this.modalService.open(TeamDialogComponent, { centered: true, size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.member = member;

    modalRef.result.then((formData: FormData | null) => {
      if (formData) {
        this.teamService.updateTeamMember(member.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Team member updated successfully', 'Close', { duration: 3000 });
            this.loadTeam();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to update team member', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }

  deleteTeamMember(member: TeamMember): void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.title = 'Delete Team Member';
    modalRef.componentInstance.message = `Are you sure you want to delete "${member.name}"? This operation cannot be undone.`;
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.isDanger = true;

    modalRef.result.then((confirmed: boolean) => {
      if (confirmed) {
        this.teamService.deleteTeamMember(member.id).subscribe({
          next: () => {
            this.snackBar.open('Team member deleted successfully', 'Close', { duration: 3000 });
            this.loadTeam();
          },
          error: (err) => {
            this.snackBar.open(err.message || 'Failed to delete team member', 'Close', { duration: 4000 });
          }
        });
      }
    }, () => {});
  }
}
