import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiClientService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request', (done) => {
    const mockResponse = [{ id: 1, name: 'Test' }];

    service.get<{ id: number; name: string }[]>('test-endpoint').subscribe(res => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('/api/test-endpoint');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should perform POST request with JSON header', (done) => {
    const payload = { name: 'Test' };
    const mockResponse = { id: 1, name: 'Test' };

    service.post<{ id: number; name: string }>('test-endpoint', payload).subscribe(res => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('/api/test-endpoint');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should perform DELETE request', (done) => {
    service.delete<void>('test-endpoint/1').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/test-endpoint/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle 404 error with user-friendly message', (done) => {
    service.get('non-existent').subscribe({
      next: () => fail('Should have failed'),
      error: (err: Error) => {
        expect(err.message).toBe('The requested resource was not found.');
        done();
      }
    });

    const req = httpMock.expectOne('/api/non-existent');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
