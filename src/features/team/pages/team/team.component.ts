import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TeamMember } from '../../models/team-member.model';
import { AuthService } from '../../../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  private readonly teamService = inject(TeamService);
  private readonly authService = inject(AuthService);

  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });
  currentUserRole = toSignal(this.authService.currentUserRole$, { initialValue: null });

  isAdminOrManager = computed(() => {
    const role = this.currentUserRole()?.toLowerCase();
    return role === 'admin' || role === 'manager';
  });

  teamMembers = signal<TeamMember[]>([]);
  showAddTeamMemberForm = signal<boolean>(false);
  editTeamMember = signal<TeamMember | null>(null);
  isEditing = computed(() => this.editTeamMember() !== null);

  newTeamMember: TeamMember = { id: 0, name: '', role: '', imageUrl: '' };

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  loadTeamMembers(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (teamMembers) => {
        this.teamMembers.set(teamMembers);
      },
      error: (err) => {
        console.error('Failed to load team members', err);
      }
    });
  }

  toggleAddTeamMemberForm(): void {
    this.showAddTeamMemberForm.update(value => !value);
  }

  onAddTeamMember(form: NgForm, files: FileList | null): void {
    if (form.valid && files && files.length > 0) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('role', form.value.role);
      formData.append('email', form.value.email ?? '');
      formData.append('linkedInUrl', form.value.linkedInUrl ?? '');
      formData.append('details', form.value.details ?? '');
      formData.append('file', files[0]);

      this.teamService.addTeamMember(formData).subscribe({
        next: (teamMember) => {
          this.teamMembers.update(members => [...members, teamMember]);
          this.toggleAddTeamMemberForm();
          form.resetForm();
        },
        error: (err) => {
          console.error('Failed to add team member', err);
        }
      });
    }
  }

  startEdit(teamMember: TeamMember): void {
    this.editTeamMember.set({ ...teamMember });
  }

  cancelEdit(): void {
    this.editTeamMember.set(null);
  }

  onUpdateTeamMember(): void {
    const memberToUpdate = this.editTeamMember();
    if (memberToUpdate && memberToUpdate.id) {
      this.teamService.updateTeamMember(memberToUpdate.id, memberToUpdate).subscribe({
        next: (updatedMember) => {
          this.teamMembers.update(members =>
            members.map(m => (m.id === updatedMember.id ? updatedMember : m))
          );
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Failed to update team member', err);
        }
      });
    }
  }

  onDeleteTeamMember(id: number): void {
    if (confirm('Are you sure you want to delete this team member?')) {
      this.teamService.deleteTeamMember(id).subscribe({
        next: () => {
          this.teamMembers.update(members => members.filter(m => m.id !== id));
        },
        error: (err) => {
          console.error('Failed to delete team member', err);
        }
      });
    }
  }
}