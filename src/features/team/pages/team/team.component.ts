import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../models/team-member.model';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  private readonly teamService = inject(TeamService);

  teamMembers = signal<TeamMember[]>([]);

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
}