import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home/pages/home/home.component';
import { AboutDetailsComponent } from '../features/about/pages/about/about-details.component';
import { ProjectsComponent } from '../features/projects/pages/projects/projects.component';
import { TeamComponent } from '../features/team/pages/team/team.component';
import { GalleryComponent } from '../features/gallery/pages/gallery/gallery.component';
import { AdminLoginComponent } from '../features/authentication/pages/login/admin-login.component';
import { InquiryDetailsComponent } from '../features/inquiries/pages/inquiry-admin/inquiry-details.component';
import { OurServicesComponent } from '../features/our-services/pages/our-services/our-services.component';
import { ContactUsComponent } from '../features/contact/pages/contact/contact-us.component';
import { ClientsDetailsComponent } from '../features/clients/pages/clients/clients-details.component';
import { authGuard } from '../core/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AdminLoginComponent },
  {
    path: 'inquiries',
    component: InquiryDetailsComponent,
    canActivate: [authGuard],
    data: { roles: ['admin', 'manager'] }
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