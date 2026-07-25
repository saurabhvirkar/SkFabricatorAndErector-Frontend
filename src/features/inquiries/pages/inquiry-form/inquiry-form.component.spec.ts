import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InquiryFormComponent } from './inquiry-form.component';
import { InquiryService } from '../../services/inquiry.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('InquiryFormComponent', () => {
  let component: InquiryFormComponent;
  let fixture: ComponentFixture<InquiryFormComponent>;
  let inquiryServiceSpy: jasmine.SpyObj<InquiryService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('InquiryService', ['submitInquiry']);

    await TestBed.configureTestingModule({
      imports: [InquiryFormComponent, ReactiveFormsModule],
      providers: [{ provide: InquiryService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(InquiryFormComponent);
    component = fixture.componentInstance;
    inquiryServiceSpy = TestBed.inject(InquiryService) as jasmine.SpyObj<InquiryService>;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as invalid when empty', () => {
    expect(component.inquiryForm.valid).toBeFalse();
  });

  it('should validate name, email, and message as required', () => {
    component.inquiryForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'Quote',
      category: 'Industrial Piping',
      preferredContact: 'Email',
      message: 'Need piping quotation.'
    });
    expect(component.inquiryForm.valid).toBeTrue();
  });

  it('should submit inquiry and set status to success on API success', () => {
    inquiryServiceSpy.submitInquiry.and.returnValue(of({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Need piping quotation.'
    }));

    component.inquiryForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
      subject: '',
      category: '',
      preferredContact: 'Email',
      message: 'Need piping quotation.'
    });

    component.onSubmit();

    expect(inquiryServiceSpy.submitInquiry).toHaveBeenCalled();
    expect(component.submissionStatus()).toBe('success');
  });

  it('should handle API error gracefully', () => {
    inquiryServiceSpy.submitInquiry.and.returnValue(throwError(() => new Error('Server Error')));

    component.inquiryForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
      subject: '',
      category: '',
      preferredContact: 'Email',
      message: 'Need piping quotation.'
    });

    component.onSubmit();

    expect(inquiryServiceSpy.submitInquiry).toHaveBeenCalled();
    expect(component.submissionStatus()).toBe('error');
  });
});
