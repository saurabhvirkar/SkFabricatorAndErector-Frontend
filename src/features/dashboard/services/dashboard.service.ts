import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProjectService } from '../../projects/services/project.service';
import { ServiceService } from '../../our-services/services/service.service';
import { TeamService } from '../../team/services/team.service';
import { InquiryService } from '../../inquiries/services/inquiry.service';
import { GalleryService } from '../../gallery/services/gallery.service';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly projectService = inject(ProjectService);
  private readonly serviceService = inject(ServiceService);
  private readonly teamService = inject(TeamService);
  private readonly inquiryService = inject(InquiryService);
  private readonly galleryService = inject(GalleryService);

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      projects: this.projectService.getProjects().pipe(catchError(() => of([]))),
      services: this.serviceService.getServices().pipe(catchError(() => of([]))),
      team: this.teamService.getTeamMembers().pipe(catchError(() => of([]))),
      inquiries: this.inquiryService.getInquiries().pipe(catchError(() => of([]))),
      photos: this.galleryService.getPhotos().pipe(catchError(() => of([])))
    }).pipe(
      map(({ projects, services, team, inquiries, photos }) => ({
        totalProjects: projects?.length || 0,
        totalServices: services?.length || 0,
        totalTeamMembers: team?.length || 0,
        totalInquiries: inquiries?.length || 0,
        totalPhotos: photos?.length || 0
      }))
    );
  }
}
