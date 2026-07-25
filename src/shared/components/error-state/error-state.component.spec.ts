import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ErrorStateComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit retry event when retry button clicked', () => {
    spyOn(component.retry, 'emit');
    component.showRetry = true;
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.retry.emit).toHaveBeenCalled();
  });
});
