import { TestBed } from '@angular/core/testing';
import { HomeSliderService } from './home-slider.service';
import { ApiClientService } from '../../../core/api/api-client.service';
import { of } from 'rxjs';
import { HomeSlider } from '../models/home-slider.model';

describe('HomeSliderService', () => {
  let service: HomeSliderService;
  let apiClientSpy: jasmine.SpyObj<ApiClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiClientService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        HomeSliderService,
        { provide: ApiClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(HomeSliderService);
    apiClientSpy = TestBed.inject(ApiClientService) as jasmine.SpyObj<ApiClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get<HomeSlider[]>("homeslider")', (done) => {
    const mockSliders: HomeSlider[] = [{ id: 1, title: 'Slide 1', description: 'Desc 1', imageUrl: 'url1', publicId: 'p1' }];
    apiClientSpy.get.and.returnValue(of(mockSliders));

    service.getHomeSliders().subscribe(result => {
      expect(result).toEqual(mockSliders);
      expect(apiClientSpy.get).toHaveBeenCalledWith('homeslider');
      done();
    });
  });

  it('should call post<HomeSlider>("homeslider", formData, true)', (done) => {
    const formData = new FormData();
    const mockSlider: HomeSlider = { id: 2, title: 'New Slide', description: 'New Desc', imageUrl: 'url2', publicId: 'p2' };
    apiClientSpy.post.and.returnValue(of(mockSlider));

    service.addHomeSlider(formData).subscribe(result => {
      expect(result).toEqual(mockSlider);
      expect(apiClientSpy.post).toHaveBeenCalledWith('homeslider', formData, true);
      done();
    });
  });

  it('should call delete<void>("homeslider/1")', (done) => {
    apiClientSpy.delete.and.returnValue(of(void 0));

    service.deleteHomeSlider(1).subscribe(() => {
      expect(apiClientSpy.delete).toHaveBeenCalledWith('homeslider/1');
      done();
    });
  });
});
