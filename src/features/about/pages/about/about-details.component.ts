import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { COMPANY_DETAILS, COMPANY_LEADERSHIP, LeadershipMemberItem } from '../../../../app/core/data/company-content';
import { GalleryService } from '../../../gallery/services/gallery.service';
import { TeamService } from '../../../team/services/team.service';
import { GalleryImage } from '../../../gallery/models/gallery-image.model';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';
import { SlotImageComponent } from '../../../../shared/components/slot-image/slot-image.component';
import { PageImageService } from '../../../../app/core/services/page-image.service';

@Component({
  selector: 'app-about-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ScrollRevealDirective,
    WeldSeamDividerComponent,
    SlotImageComponent
  ],
  templateUrl: './about-details.component.html',
  styleUrls: ['./about-details.component.scss']
})
export class AboutDetailsComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly pageImageService = inject(PageImageService);
  private readonly teamService = inject(TeamService);

  company = COMPANY_DETAILS;
  infrastructurePhotos = signal<GalleryImage[]>([]);
  leadership = signal<LeadershipMemberItem[]>(COMPANY_LEADERSHIP);

  focusGoalMission = [
    {
      title: 'OUR FOCUS',
      subtitle: 'Integrated Solutions',
      icon: 'center_focus_strong',
      desc: 'To provide integrated solutions to requirements for all types of structural design and work, fabrication, piping, machine installation, machine maintenance, and any modifications required to complete the work.',
      offsetClass: 'translate-y-0 lg:translate-y-0 border-t-4 border-t-[#0B4C8C]'
    },
    {
      title: 'OUR GOAL',
      subtitle: 'Value & Modularization',
      icon: 'ads_click',
      desc: 'To maximize the business value of your project through early contractor involvement and optimize the fabrication process with modularization.',
      offsetClass: 'translate-y-0 lg:-translate-y-4 border-t-4 border-t-[#F5A623] shadow-2xl'
    },
    {
      title: 'OUR MISSION',
      subtitle: 'Creating Better Solutions',
      icon: 'rocket_launch',
      desc: 'Adding value to everything we do by creating better solutions and building safer, highly efficient industrial plants.',
      offsetClass: 'translate-y-0 lg:translate-y-0 border-t-4 border-t-[#0B4C8C]'
    }
  ];

  safetyTriad = [
    {
      title: 'GUARANTEED QUALITY',
      icon: 'workspace_premium',
      points: [
        'Professional certification & quality assurance.',
        'Comprehensive project documentation & NDT inspection report.'
      ]
    },
    {
      title: 'GUARANTEED SERVICE',
      icon: 'support_agent',
      points: [
        'Dedicated single point of contact throughout each project.',
        'Friendly, knowledgeable, and professional engineering staff.'
      ]
    },
    {
      title: 'GUARANTEED DELIVERY',
      icon: 'local_shipping',
      points: [
        'Make no commitments we cannot keep.',
        'Will not accept a project that we cannot deliver on time.'
      ]
    }
  ];

  ngOnInit(): void {
    this.pageImageService.loadAllSlots().subscribe();

    this.galleryService.getPhotos().subscribe({
      next: (photos) => {
        const sliderPhotos = photos.filter(p => p.isAboutSlider);
        if (sliderPhotos.length > 0) {
          this.infrastructurePhotos.set(sliderPhotos);
        }
      },
      error: () => {}
    });

    this.loadLeadership();
  }

  private loadLeadership(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => {
        if (members && members.length > 0) {
          const mapped: LeadershipMemberItem[] = members.map((m, index) => {
            const fallback = COMPANY_LEADERSHIP[index] || COMPANY_LEADERSHIP[0];
            return {
              id: m.id,
              name: m.name,
              role: m.role,
              details: m.details || fallback.details,
              badge: index === 0 ? 'Founder & Managing Director' : index === 1 ? 'General Manager & Operations Head' : 'Project Manager & Engineering Head',
              icon: index === 0 ? 'workspace_premium' : index === 1 ? 'engineering' : 'architecture',
              quote: fallback.quote,
              tags: fallback.tags,
              email: m.email || 'skfabricator2070@gmail.com',
              linkedInUrl: m.linkedInUrl,
              imageUrl: m.imageUrl
            };
          });
          this.leadership.set(mapped);
        }
      },
      error: () => {
        this.leadership.set(COMPANY_LEADERSHIP);
      }
    });
  }
}