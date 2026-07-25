import { TestBed } from '@angular/core/testing';
import { ServiceService } from './service.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { Service } from '../models/service.model';

describe('ServiceService', () => {
  let service: ServiceService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ServiceService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(ServiceService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<Service[]>("ourservices")', (done) => {
    const mockServices: Service[] = [{ id: 1, name: 'S1', summary: 'Sum1', description: 'D1', imageUrl: 'i1' }];
    apiClientSpy.get.and.returnValue(of(mockServices));

    service.getServices().subscribe(result => {
      expect(result).toEqual(mockServices);
      expect(apiClientSpy.get).toHaveBeenCalledWith('ourservices');
      done();
    });
  });

  it('should call post<Service>("ourservices", formData, true)', (done) => {
    const formData = new FormData();
    const mockService: Service = { id: 2, name: 'S2', summary: 'Sum2', description: 'D2', imageUrl: 'i2' };
    apiClientSpy.post.and.returnValue(of(mockService));

    service.addService(formData).subscribe(result => {
      expect(result).toEqual(mockService);
      expect(apiClientSpy.post).toHaveBeenCalledWith('ourservices', formData, true);
      done();
    });
  });

  it('should call delete<void>("ourservices/1")', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteService(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('ourservices/1');
      done();
    });
  });
});
