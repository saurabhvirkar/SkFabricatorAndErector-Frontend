import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { COMPANY_DETAILS } from '../../../../app/core/data/company-content';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import { WeldSeamDividerComponent } from '../../../../shared/components/weld-seam-divider/weld-seam-divider.component';

@Component({
  selector: 'app-about-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective, WeldSeamDividerComponent],
  templateUrl: './about-details.component.html',
  styleUrls: ['./about-details.component.scss']
})
export class AboutDetailsComponent {
  company = COMPANY_DETAILS;

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
}