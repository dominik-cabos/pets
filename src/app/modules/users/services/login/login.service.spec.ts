import { TestBed } from '@angular/core/testing';

import {LoginService, USER_API_BASE_URL, USER_API_STORAGE_KEY} from './login.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PET_API_BASE_URL} from '../../../pets';
import {take} from 'rxjs/operators';

describe('LoginService', () => {
  let service: LoginService;
  let httpTestingController: HttpTestingController;

  const MOCK_AUTHENTICATION = {code: 200, type: 'unknown', message: 'logged in user session:1595620255408'};
  const MOCK_USER = {username: 'dominik', password: 'ABCxyz123'};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: USER_API_BASE_URL, useValue: ''},
      ]
    });
    service = TestBed.inject(LoginService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage.removeItem(USER_API_STORAGE_KEY);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return authentication response when the api authenticates', () => {


    service.authenticate(MOCK_USER).subscribe((authentication) => {
      expect(authentication).toEqual(MOCK_AUTHENTICATION);
    });

    const req = httpTestingController.expectOne('user/login?' + new URLSearchParams(MOCK_USER).toString());
    req.flush(MOCK_AUTHENTICATION);

    service.getLoggedUser().pipe(take(1)).subscribe((user) => {
      expect(user.username).toEqual(MOCK_USER.username);
      expect(user.session).toBeTruthy();
      expect(user).toEqual(service.loggedUserValue);
      expect(localStorage.getItem(USER_API_STORAGE_KEY)).toBeTruthy();
    });


  });

  it('should clear session when logged out', () => {

    service.logout();

    const req = httpTestingController.expectOne('user/logout');
    req.flush(MOCK_AUTHENTICATION);

    service.getLoggedUser().pipe(take(1)).subscribe((user) => {
      expect(user).toBeNull();
      expect(localStorage.getItem(USER_API_STORAGE_KEY)).toBeFalsy();
    });

  });


});
