import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHomeComponent } from './dashboard-home.component';
import { DashboardService } from '../../services/dashboard.service';
import { InquiryService } from '../../../inquiries/services/inquiry.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;
  let mockInquiryService: jasmine.SpyObj<InquiryService>;

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj('DashboardService', ['getDashboardStats']);
    mockInquiryService = jasmine.createSpyObj('InquiryService', ['getInquiries']);

    mockDashboardService.getDashboardStats.and.returnValue(of({
      totalProjects: 12,
      totalServices: 5,
      totalTeamMembers: 8,
      totalInquiries: 15,
      totalPhotos: 24
    }));

    mockInquiryService.getInquiries.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [
        provideRouter([]),
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: InquiryService, useValue: mockInquiryService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create DashboardHomeComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard stats on init', () => {
    expect(component.stats()?.totalProjects).toBe(12);
    expect(component.stats()?.totalInquiries).toBe(15);
    expect(component.isLoading()).toBeFalse();
  });
});
