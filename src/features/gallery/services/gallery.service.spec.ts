import { TestBed } from '@angular/core/testing';
import { GalleryService } from './gallery.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { GalleryImage } from '../models/gallery-image.model';

describe('GalleryService', () => {
  let service: GalleryService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        GalleryService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(GalleryService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<GalleryImage[]>("photos")', (done) => {
    const mockPhotos: GalleryImage[] = [{ id: 1, url: 'u1', isMain: true, publicId: 'p1', category: 'Piping', isAboutSlider: false }];
    apiClientSpy.get.and.returnValue(of(mockPhotos));

    service.getPhotos().subscribe(result => {
      expect(result).toEqual(mockPhotos);
      expect(apiClientSpy.get).toHaveBeenCalledWith('photos');
      done();
    });
  });

  it('should filter photos by category', (done) => {
    apiClientSpy.get.and.returnValue(of([]));

    service.getImages('Piping').subscribe(() => {
      expect(apiClientSpy.get).toHaveBeenCalledWith('photos?category=Piping');
      done();
    });
  });

  it('should upload photo via post<GalleryImage>("photos", formData, true)', (done) => {
    const formData = new FormData();
    const mockImage: GalleryImage = { id: 2, url: 'u2', isMain: false, publicId: 'p2', category: 'Erection', isAboutSlider: true };
    apiClientSpy.post.and.returnValue(of(mockImage));

    service.uploadImage(formData, 'Erection', true).subscribe(result => {
      expect(result).toEqual(mockImage);
      expect(apiClientSpy.post).toHaveBeenCalledWith('photos', formData, true);
      done();
    });
  });

  it('should delete photo via delete<void>("photos/1")', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteImage(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('photos/1');
      done();
    });
  });
});
