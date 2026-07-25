import { ChangeDetectionStrategy, Component, computed, signal, OnInit, inject } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

type ProjectCategory = 'All' | 'Piping' | 'Fabrication' | 'Erection' | 'Maintenance';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);

  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });
  currentUserRole = toSignal(this.authService.currentUserRole$, { initialValue: null });

  isAdminOrManager = computed(() => {
    const role = this.currentUserRole()?.toLowerCase();
    return role === 'admin' || role === 'manager';
  });

  newProject: Project = { id: 0, title: '', description: '', category: 'Piping', image: '' };
  currentYear = new Date().getFullYear();
  categories: ProjectCategory[] = ['All', 'Piping', 'Fabrication', 'Erection', 'Maintenance'];

  projects = signal<Project[]>([]);
  showAddProjectForm = signal<boolean>(false);
  editProject = signal<Project | null>(null);
  isEditing = computed(() => this.editProject() !== null);
  activeFilter = signal<ProjectCategory>('All'); 

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') {
      return this.projects();
    }
    return this.projects().filter(p => p.category === filter);
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (err) => {
        console.error('Failed to load projects', err);
      }
    });
  }

  setFilter(category: ProjectCategory) {
    this.activeFilter.set(category);
  }

  toggleAddProjectForm(): void {
    this.showAddProjectForm.update(value => !value);
  }

  onAddProject(form: NgForm, files: FileList | null): void {
    if (form.valid && files && files.length > 0) {
      const formData = new FormData();
      formData.append('title', form.value.title);
      formData.append('description', form.value.description);
      formData.append('category', form.value.category);
      formData.append('file', files[0]);

      this.projectService.addProject(formData).subscribe({
        next: (project) => {
          this.projects.update(projects => [...projects, project]);
          this.toggleAddProjectForm();
          form.resetForm();
        },
        error: (err) => {
          console.error('Failed to add project', err);
        }
      });
    }
  }

  startEdit(project: Project): void {
    this.editProject.set({ ...project });
  }

  cancelEdit(): void {
    this.editProject.set(null);
  }

  onUpdateProject(): void {
    const projectToUpdate = this.editProject();
    if (projectToUpdate && projectToUpdate.id) {
      this.projectService.updateProject(projectToUpdate.id, projectToUpdate).subscribe({
        next: (updatedProject) => {
          this.projects.update(projects =>
            projects.map(p => (p.id === updatedProject.id ? updatedProject : p))
          );
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Failed to update project', err);
        }
      });
    }
  }

  onDeleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.projects.update(projects => projects.filter(p => p.id !== projectId));
        },
        error: (err) => {
          console.error('Failed to delete project', err);
          alert('Project deletion failed!');
        }
      });
    }
  }
}
