import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/pages/home/home.component';
import { AboutDetailsComponent } from '../features/about/pages/about/about-details.component';
import { ProjectsComponent } from '../features/projects/pages/projects/projects.component';
import { TeamComponent } from '../features/team/pages/team/team.component';
import { GalleryComponent } from '../features/gallery/pages/gallery/gallery.component';
import { AdminLoginComponent } from '../features/authentication/pages/login/admin-login.component';
import { OurServicesComponent } from '../features/our-services/pages/our-services/our-services.component';
import { ContactUsComponent } from '../features/contact/pages/contact/contact-us.component';
import { ClientsDetailsComponent } from '../features/clients/pages/clients/clients-details.component';
import { authGuard } from '../core/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AdminLoginComponent },
  {
    path: 'ops/adminportal',
    loadComponent: () =>
      import('../features/admin-console/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Manager'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          )
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-projects/admin-projects.component').then(
            (m) => m.AdminProjectsComponent
          )
      },
      {
        path: 'services',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-services/admin-services.component').then(
            (m) => m.AdminServicesComponent
          )
      },
      {
        path: 'team',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-team/admin-team.component').then(
            (m) => m.AdminTeamComponent
          )
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-gallery/admin-gallery.component').then(
            (m) => m.AdminGalleryComponent
          )
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-clients/admin-clients.component').then(
            (m) => m.AdminClientsComponent
          )
      },
      {
        path: 'sliders',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-sliders/admin-sliders.component').then(
            (m) => m.AdminSlidersComponent
          )
      },
      {
        path: 'inquiries',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-inquiries/admin-inquiries.component').then(
            (m) => m.AdminInquiriesComponent
          )
      },
      {
        path: 'users',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-users/admin-users.component').then(
            (m) => m.AdminUsersComponent
          )
      }
    ]
  },
  { path: 'about', component: AboutDetailsComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'our-services', component: OurServicesComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'clients', component: ClientsDetailsComponent },
  { path: '**', redirectTo: '' }
];