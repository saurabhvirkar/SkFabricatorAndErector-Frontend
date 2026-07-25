import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiService = inject(ApiClientService);

  getProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('project');
  }

  addProject(projectData: FormData): Observable<Project> {
    return this.apiService.post<Project>('project', projectData, true);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.apiService.delete<void>(`project/${projectId}`);
  }

  updateProject(projectId: number, projectData: unknown): Observable<Project> {
    return this.apiService.put<Project>(`project/${projectId}`, projectData);
  }
}
