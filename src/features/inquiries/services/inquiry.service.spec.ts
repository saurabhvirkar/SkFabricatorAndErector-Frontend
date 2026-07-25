import { TestBed } from '@angular/core/testing';
import { InquiryService } from './inquiry.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';

describe('InquiryService', () => {
  let service: InquiryService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        InquiryService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(InquiryService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<Inquiry[]>("inquiry") when getInquiries is called', (done) => {
    const mockInquiries: Inquiry[] = [
      { id: 1, name: 'John', email: 'john@example.com', message: 'Hello' }
    ];
    apiClientSpy.get.and.returnValue(of(mockInquiries));

    service.getInquiries().subscribe((result) => {
      expect(result).toEqual(mockInquiries);
      expect(apiClientSpy.get).toHaveBeenCalledWith('inquiry');
      done();
    });
  });

  it('should call post<Inquiry>("inquiry", data) when submitInquiry is called', (done) => {
    const newInquiry: Inquiry = { name: 'Jane', email: 'jane@example.com', message: 'Test inquiry' };
    apiClientSpy.post.and.returnValue(of(newInquiry));

    service.submitInquiry(newInquiry).subscribe((result) => {
      expect(result).toEqual(newInquiry);
      expect(apiClientSpy.post).toHaveBeenCalledWith('inquiry', newInquiry);
      done();
    });
  });

  it('should call delete<void>("inquiry/1") when deleteInquiry is called', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteInquiry(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('inquiry/1');
      done();
    });
  });
});
