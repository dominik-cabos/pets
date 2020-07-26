import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

import { PetHttpService } from '../../services/pet-http/pet-http.service';
import { Pet } from '../../models/pet';

@Component({
  selector: 'pet-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private petService: PetHttpService
  ) {}

  petForm: FormGroup;
  registeredPet: Pet;
  spinner: boolean;

  ngOnInit(): void {
    this.initForm();
  }

  register(formDirective: FormGroupDirective): void {
    this.petService.register(this.addCategory(this.petForm)).subscribe(
      (petRegistered) => {
        this.registeredPet = petRegistered;
        formDirective.resetForm();
      },
      () => {
        this.loading(false);
      },
      () => {
        this.loading(false);
      }
    );

    this.loading();
  }

  initForm(): void {
    this.petForm = this.formBuilder.group({
      id: null,
      name: [null, Validators.required],
      category : [null],
    });
  }

  private loading(start = true): void {
    if (start) {
      this.spinner = true;
      this.petForm.disable();
    } else {
      this.spinner = false;
      this.petForm.enable();
    }
  }

  private addCategory(petForm: FormGroup): Pet {
    const petWithCategory = {...petForm.value};
    if (petForm.value.category) {
      petWithCategory.category = {name : petForm.value.category};
    }
    return petWithCategory;
  }
}
