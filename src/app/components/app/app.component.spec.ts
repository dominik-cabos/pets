import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {RouterTestingModule, SpyNgModuleFactoryLoader} from '@angular/router/testing';
import { AppComponent } from './app.component';
import {ErrorsService} from '../../services/errors.service';
import {LoginComponent, LoginService} from '../../modules/users';
import {Router, RouterOutlet} from '@angular/router';
import {EMPTY, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgModuleFactoryLoader, NO_ERRORS_SCHEMA} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Location, LocationStrategy} from '@angular/common';
import {MockLocationStrategy, SpyLocation} from '@angular/common/testing';
import {RegisterComponent, SearchComponent} from '../../modules/pets';
import {AuthGuard} from '../../helpers/router.guard';
import {ReactiveFormsModule} from '@angular/forms';

describe('AppComponent', () => {

  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  const mockErrorService = jasmine.createSpyObj(['httpError', 'getErrors']);
  const mockLoginService = jasmine.createSpyObj(['getLoggedUser', 'logout']);
  const mockSnackBar = jasmine.createSpyObj(['open']);
  const mockBreakpointObserver =  jasmine.createSpyObj(['observe']);
  mockBreakpointObserver.observe.and.returnValue(of(true));

  const MOCK_USER = {username: 'dominik', password: 'ABCxyz123'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes( [
        {path: 'find', component: SearchComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'login', component: LoginComponent},
        { path: '',   redirectTo: '/find', pathMatch: 'full' },
      ]), ReactiveFormsModule],
      declarations: [AppComponent],
      providers: [
        { provide: ErrorsService, useValue: mockErrorService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();


  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should  display a notification when an error is received', () => {
    mockLoginService.getLoggedUser.and.returnValue(of(null));
    mockErrorService.getErrors.and.returnValue(of('Error msg'));
    fixture.detectChanges();
    expect(mockSnackBar.open).toHaveBeenCalled();
  });

  it('should redirect to login if not logged in', () => {
    const routerSpy = spyOn(router, 'navigate');
    mockErrorService.getErrors.and.returnValue(EMPTY);
    mockLoginService.getLoggedUser.and.returnValue(of(null));
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to main page when login service sends new user', () => {
    const routerSpy = spyOn(router, 'navigate');
    mockErrorService.getErrors.and.returnValue(EMPTY);
    mockLoginService.getLoggedUser.and.returnValue(of(MOCK_USER));
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should call logout service when requested logout', () => {
    mockErrorService.getErrors.and.returnValue(EMPTY);
    mockLoginService.getLoggedUser.and.returnValue(of(null));
    fixture.detectChanges();
    app.logout();
    expect(mockLoginService.logout).toHaveBeenCalled();
  });



});
