import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TeamMember } from '../models/team-member.model';
import { ApiClientService } from '../../../core/api/api-client.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly apiService = inject(ApiClientService);

  getTeamMembers(): Observable<TeamMember[]> {
    return this.apiService.get<TeamMember[]>('teammembers');
  }

  addTeamMember(teamMemberData: FormData): Observable<TeamMember> {
    return this.apiService.post<TeamMember>('teammembers', teamMemberData, true);
  }

  deleteTeamMember(id: number): Observable<void> {
    return this.apiService.delete<void>(`teammembers/${id}`);
  }

  updateTeamMember(id: number, teamMemberData: TeamMember): Observable<TeamMember> {
    return this.apiService.put<TeamMember>(`teammembers/${id}`, teamMemberData);
  }
}
