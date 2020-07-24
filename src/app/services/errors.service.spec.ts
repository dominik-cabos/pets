import { TestBed } from '@angular/core/testing';

import { ErrorsService } from './errors.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('ErrorsService', () => {
  let service: ErrorsService;

  const MOCK_ERROR = new HttpErrorResponse({ error: 'Error' });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should communicate http errors', () => {
    service.getErrors().subscribe((err) => {
      expect(err).toBeTruthy();
    });
    service.httpError(MOCK_ERROR);
  });
});
