import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { PetHttpService } from '../..';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let submitButton: HTMLElement;
  let successMessage: DebugElement;
  let notFoundMessage: DebugElement;
  let petFoundDetails: DebugElement;

  const MOCK_PET = { name: 'Lili' };
  const DEFAULT_PET_IMG = '1';
  const GIVEN_PET_IMG = 'http://img.mock/lili.jpg';
  const mockPetService = jasmine.createSpyObj(['find']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [ReactiveFormsModule],
      schemas: [   NO_ERRORS_SCHEMA],
      providers: [
        { provide: PetHttpService, useValue: mockPetService },
        { provide: 'DEFAULT_PET_IMAGE', useValue: DEFAULT_PET_IMG },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    submitButton = fixture.debugElement.query(By.css('button[type=submit]'))
      .nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a pet when the service finds a pet with the given id', () => {
    mockPetService.find.and.returnValue(of(MOCK_PET));
    component.queryBox.setValue(1);
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(successMessage).toBeTruthy();
    expect(petFoundDetails).toBeTruthy();
    expect(component.foundPet.avatar).toEqual(DEFAULT_PET_IMG);
  });

  it('should notify when a Pet hasn\'t been found', () => {
    mockPetService.find.and.returnValue(throwError({ status: 404 }));
    component.queryBox.setValue('x');
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(notFoundMessage).toBeTruthy();
    expect(successMessage).toBeFalsy();
    expect(petFoundDetails).toBeFalsy();
  });

  it('should cancel operation if a different error comes through', () => {
    mockPetService.find.and.returnValue(throwError({ status: 405 }));
    component.queryBox.setValue('x');
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    getUIState();
    expect(notFoundMessage).toBeFalsy();
    expect(successMessage).toBeFalsy();
    expect(petFoundDetails).toBeFalsy();
  });

  it('should create', () => {
    mockPetService.find.and.returnValue(
      of({
        ...MOCK_PET,
        photoUrls: [GIVEN_PET_IMG],
      })
    );
    component.queryBox.setValue(1);
    fixture.detectChanges();
    submitButton.click();
    fixture.detectChanges();
    expect(component.foundPet.avatar).toEqual(GIVEN_PET_IMG);
  });

  function getUIState(): void {
    notFoundMessage = fixture.debugElement.query(By.css('.error.result'));
    successMessage = fixture.debugElement.query(By.css('.success.result'));
    petFoundDetails = fixture.debugElement.query(By.css('.found-pet'));
  }
});
