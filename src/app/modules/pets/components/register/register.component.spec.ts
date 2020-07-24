import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {PetHttpService} from '../..';
import {By} from '@angular/platform-browser';
import {of, throwError} from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let submitButton: HTMLElement;
  let successMessage: DebugElement;

  const mockPetService = jasmine.createSpyObj(['register']);
  const MOCK_REGISTRATION = { id: '1234567890' , name: 'Lili' };
  const MOCK_PET = { name: 'Lili' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: PetHttpService, useValue: mockPetService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    submitButton = fixture.debugElement.query(By.css('button[type=submit]'))
      .nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display a confirmation when the service returns a confirmation', () => {
    mockPetService.register.and.returnValue(of(MOCK_REGISTRATION));
    component.petForm.controls.name.setValue(MOCK_PET.name);
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(successMessage).toBeTruthy();
  });


  it('should not display a confirmation if there\'s been an error during the request', () => {
    mockPetService.register.and.returnValue(throwError(1));
    component.petForm.controls.name.setValue(MOCK_PET.name);
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(successMessage).toBeFalsy();
  });

  function getUIState(): void {
    successMessage = fixture.debugElement.query(By.css('.success.result'));
  }

});
