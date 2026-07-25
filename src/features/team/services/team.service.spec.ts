import { TestBed } from '@angular/core/testing';
import { TeamService } from './team.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { TeamMember } from '../models/team-member.model';

describe('TeamService', () => {
  let service: TeamService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        TeamService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(TeamService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<TeamMember[]>("teammembers")', (done) => {
    const mockMembers: TeamMember[] = [{ id: 1, name: 'M1', role: 'R1', imageUrl: 'img1' }];
    apiClientSpy.get.and.returnValue(of(mockMembers));

    service.getTeamMembers().subscribe(result => {
      expect(result).toEqual(mockMembers);
      expect(apiClientSpy.get).toHaveBeenCalledWith('teammembers');
      done();
    });
  });

  it('should call post<TeamMember>("teammembers", formData, true)', (done) => {
    const formData = new FormData();
    const mockMember: TeamMember = { id: 2, name: 'M2', role: 'R2', imageUrl: 'img2' };
    apiClientSpy.post.and.returnValue(of(mockMember));

    service.addTeamMember(formData).subscribe(result => {
      expect(result).toEqual(mockMember);
      expect(apiClientSpy.post).toHaveBeenCalledWith('teammembers', formData, true);
      done();
    });
  });

  it('should call delete<void>("teammembers/1")', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteTeamMember(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('teammembers/1');
      done();
    });
  });
});
