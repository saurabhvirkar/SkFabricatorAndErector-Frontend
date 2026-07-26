import { ChangeDetectionStrategy, Component, signal, OnInit, inject } from '@angular/core';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';

type ProjectCategory = 'All' | 'Piping' | 'Fabrication' | 'Erection' | 'Maintenance';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  currentYear = new Date().getFullYear();
  categories: ProjectCategory[] = ['All', 'Piping', 'Fabrication', 'Erection', 'Maintenance'];

  projects = signal<Project[]>([]);
  activeFilter = signal<ProjectCategory>('All');

  filteredProjects = signal<Project[]>([]);

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.updateFilteredProjects();
      },
      error: (err) => {
        console.error('Failed to load projects', err);
      }
    });
  }

  setFilter(category: ProjectCategory): void {
    this.activeFilter.set(category);
    this.updateFilteredProjects();
  }

  private updateFilteredProjects(): void {
    const filter = this.activeFilter();
    if (filter === 'All') {
      this.filteredProjects.set(this.projects());
    } else {
      this.filteredProjects.set(this.projects().filter(p => p.category === filter));
    }
  }
}
