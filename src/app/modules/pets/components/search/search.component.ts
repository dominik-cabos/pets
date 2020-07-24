import {Component, Inject, Input, OnInit} from '@angular/core';
import {PetHttpService} from '../../services/pet-http/pet-http.service';
import {Pet} from '../../models/pet';
import {FormBuilder, FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'pet-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private petService: PetHttpService,
    @Inject('DEFAULT_PET_IMAGE') private defaultPetImage: string,
) {}

  queryBox: FormControl;
  notFound404: boolean;
  spinner: boolean;
  foundPet: Pet;

  ngOnInit(): void {
    this.initForm();
  }

  find(): void {

    this.loading();

    this.petService.find(this.queryBox.value).pipe(
      map(pet => this.setAvatar(pet))
    ).subscribe(
      (petFound) => {
        this.foundPet = petFound;

      },
      (error) => {
        if (error.status === 404) {
          this.foundPet = null;
          this.notFound404 = true;
          this.loading(false);
        }
      },
      () => {
        this.loading(false);
      }
    );

  }

  private initForm(): void {
    this.queryBox = this.formBuilder.control({ value: '', disabled: false });
  }

  private loading(start = true): void {
    if (start) {
      this.spinner = true;
      this.queryBox.disable();
      this.notFound404 = false;
      this.foundPet = null;
    }
    else {
      this.spinner = false;
      this.queryBox.enable();
    }
  }

  private setAvatar(pet: Pet): Pet{
    let avatar;

    if (pet.photoUrls && pet.photoUrls[0] && pet.photoUrls[0].startsWith('http')) {
      avatar = pet.photoUrls[0];
    }
    else {
      avatar = this.defaultPetImage;
    }

    return {avatar, ...pet};
  }
}
