import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../..';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let submitButton: HTMLElement;
  let errorMessage: DebugElement;

  const mockLoginService = jasmine.createSpyObj(['authenticate']);
  const MOCK_AUTHENTICATION = {
    code: 200,
    type: 'unknown',
    message: 'logged in user session:1595620255408',
  };
  const MOCK_USER = { username: 'dominik', password: 'ABCxyz123' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: LoginService, useValue: mockLoginService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    submitButton = fixture.debugElement.query(By.css('button[type=submit]'))
      .nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login user when authenticated', () => {
    mockLoginService.authenticate.and.returnValue(of(MOCK_AUTHENTICATION));
    component.loginForm.setValue(MOCK_USER);
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(errorMessage).toBeFalsy();
  });

  it('should display error message when user not authenticated', () => {
    mockLoginService.authenticate.and.returnValue(throwError(1));
    component.loginForm.setValue(MOCK_USER);
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(errorMessage).toBeTruthy();
  });

  function getUIState(): void {
    errorMessage = fixture.debugElement.query(By.css('.error.result'));
  }
});
