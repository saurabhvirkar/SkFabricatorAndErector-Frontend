import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { Project } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(ProjectService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<Project[]>("project")', (done) => {
    const mockProjects: Project[] = [{ id: 1, title: 'P1', description: 'D1', image: 'i1', category: 'Piping' }];
    apiClientSpy.get.and.returnValue(of(mockProjects));

    service.getProjects().subscribe(result => {
      expect(result).toEqual(mockProjects);
      expect(apiClientSpy.get).toHaveBeenCalledWith('project');
      done();
    });
  });

  it('should call post<Project>("project", formData, true)', (done) => {
    const formData = new FormData();
    const mockProject: Project = { id: 2, title: 'P2', description: 'D2', image: 'i2', category: 'Erection' };
    apiClientSpy.post.and.returnValue(of(mockProject));

    service.addProject(formData).subscribe(result => {
      expect(result).toEqual(mockProject);
      expect(apiClientSpy.post).toHaveBeenCalledWith('project', formData, true);
      done();
    });
  });

  it('should call put<Project>("project/1", data)', (done) => {
    const updateData = { title: 'Updated P1' };
    const mockProject: Project = { id: 1, title: 'Updated P1', description: 'D1', image: 'i1', category: 'Piping' };
    apiClientSpy.put.and.returnValue(of(mockProject));

    service.updateProject(1, updateData).subscribe(result => {
      expect(result).toEqual(mockProject);
      expect(apiClientSpy.put).toHaveBeenCalledWith('project/1', updateData);
      done();
    });
  });

  it('should call delete<void>("project/1")', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteProject(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('project/1');
      done();
    });
  });
});
