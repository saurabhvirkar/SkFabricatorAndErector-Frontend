import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { ClientDetails } from '../models/client-details.model';

describe('ClientService', () => {
  let service: ClientService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ClientService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(ClientService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<ClientDetails[]>("clientdetails")', (done) => {
    const mockClients: ClientDetails[] = [{ id: 1, name: 'C1', imageUrl: 'img1', clientUrl: 'url1' }];
    apiClientSpy.get.and.returnValue(of(mockClients));

    service.getClientDetails().subscribe(result => {
      expect(result).toEqual(mockClients);
      expect(apiClientSpy.get).toHaveBeenCalledWith('clientdetails');
      done();
    });
  });

  it('should call post<ClientDetails>("clientdetails", formData, true)', (done) => {
    const formData = new FormData();
    const mockClient: ClientDetails = { id: 2, name: 'C2', imageUrl: 'img2', clientUrl: 'url2' };
    apiClientSpy.post.and.returnValue(of(mockClient));

    service.addClient(formData).subscribe(result => {
      expect(result).toEqual(mockClient);
      expect(apiClientSpy.post).toHaveBeenCalledWith('clientdetails', formData, true);
      done();
    });
  });

  it('should call delete<void>("clientdetails/1")', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteClient(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('clientdetails/1');
      done();
    });
  });
});
