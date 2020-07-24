import { TestBed } from '@angular/core/testing';

import { PET_API_BASE_URL, PetHttpService } from './pet-http.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('PetHttpService', () => {
  let service: PetHttpService;
  let httpTestingController: HttpTestingController;

  const MOCK_REGISTRATION = { id: '1234567890', name: 'Lili' };
  const MOCK_PET = { id: 1234567890, name: 'Lili' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PET_API_BASE_URL, useValue: '' }],
    });
    service = TestBed.inject(PetHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a pet when the api finds it', () => {
    service.find(MOCK_PET.id.toString()).subscribe((pet) => {
      expect(pet).toEqual(MOCK_PET);
    });

    const req = httpTestingController.expectOne('pet/' + MOCK_PET.id);
    req.flush(MOCK_PET);
  });

  it('should register a pet', () => {
    service.register(MOCK_PET).subscribe((registration) => {
      expect(registration).toEqual(MOCK_REGISTRATION);
    });

    const req = httpTestingController.expectOne('pet');
    req.flush(MOCK_REGISTRATION);
  });
});
