import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/home/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('../features/authentication/pages/login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'ops/adminportal',
    loadComponent: () =>
      import('../features/admin-console/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    canActivate: [authGuard],
    data: { roles: ['SuperAdmin', 'Admin', 'Manager', 'Employee'] },
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
        path: 'change-password',
        loadComponent: () =>
          import('../features/account/pages/change-password/change-password.component').then(
            (m) => m.AdminChangePasswordComponent
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
      },
      {
        path: 'photos',
        loadComponent: () =>
          import('../features/admin-console/pages/admin-photo-manager/admin-photo-manager.component').then(
            (m) => m.AdminPhotoManagerComponent
          )
      }
    ]
  },
  {
    path: 'about',
    loadComponent: () => import('../features/about/pages/about/about-details.component').then(m => m.AboutDetailsComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('../features/projects/pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'team',
    loadComponent: () => import('../features/team/pages/team/team.component').then(m => m.TeamComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('../features/gallery/pages/gallery/gallery.component').then(m => m.GalleryComponent)
  },
  {
    path: 'our-services',
    loadComponent: () => import('../features/our-services/pages/our-services/our-services.component').then(m => m.OurServicesComponent)
  },
  {
    path: 'our-services/:slug',
    loadComponent: () => import('../features/our-services/pages/our-services/our-services.component').then(m => m.OurServicesComponent)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('../features/contact/pages/contact/contact-us.component').then(m => m.ContactUsComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('../features/clients/pages/clients/clients-details.component').then(m => m.ClientsDetailsComponent)
  },
  { path: '**', redirectTo: '' }
];