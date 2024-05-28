import { Component, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarColors,
  CarModel,
  FormCarModel,
  SelectedCar,
} from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import {
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './step1.component..html',
  styleUrl: './step1.component.scss',
})
export class Step1Component implements OnInit, OnDestroy {
  cancellation = new Subject<void>();
  carModels$: Observable<CarModel[]> | undefined;
  selectedCar: WritableSignal<SelectedCar> = this.carsService.selectedCar;

  selectedModelColors!: CarColors[];

  carFormGroup = new FormGroup({
    model: new FormControl<FormCarModel | null>(null),
    color: new FormControl<CarColors>(this.selectedCar().color),
  });

  constructor(private carsService: CarConfigService) {
    this.carModels$ = this.carsService.carModels$;
    this.selectedCar = this.carsService.selectedCar;
  }

  ngOnInit(): void {
    //Here we will get the right array of colors programmatically
    this.getSelectedCarColors();

    //We initialize the model formcontrol
    this.selectedCar().model.code !== ''
      ? this.carFormGroup.controls.model.patchValue(this.selectedCar().model)
      : null;

    if (this.selectedCar().color.code === '') {
      this.carFormGroup.controls.color.markAsPristine();
    } else {
      this.carFormGroup.controls.color.markAsDirty();
    }
  }

  ngOnDestroy(): void {
    this.cancellation.next();
    this.cancellation.complete();
  }

  getSelectedCarColors() {
    this.carFormGroup.controls.model.valueChanges
      .pipe(
        takeUntil(this.cancellation),
        filter((modelCode) => !!modelCode),
        switchMap((modelCode) => {
          if (this.carModels$) {
            return this.carModels$.pipe(
              map((models) =>
                models.find((model) => model.code === modelCode?.code)
              )
            );
          } else {
            return of();
          }
        })
      )
      .subscribe((model) => {
        if (model) {
          this.selectedModelColors = model?.colors;

          const findI = model.colors.findIndex(
            (color) => color.code === 'white'
          );
          const currentIndex = model.colors.findIndex(
            (color) => color.code === this.selectedCar().color.code
          );
          if (
            this.carFormGroup.controls.color.pristine ||
            !model.colors[currentIndex]
          ) {
            this.carFormGroup.controls.color.patchValue(model.colors[findI]);
          } else {
            this.carFormGroup.controls.color.patchValue(
              model.colors[currentIndex]
            );
          }
          this.selectedCar.update((prev) => {
            const updatedVal: SelectedCar = {
              ...prev,
              color:
                !model.colors[currentIndex] || prev.color.code === ''
                  ? model.colors[findI]
                  : prev.color,
            };
            return updatedVal;
          });
        }
      });
  }

  saveCarData() {
    const carModel = this.carFormGroup.controls.model.value;
    const carColorCode = this.carFormGroup.controls.color.value?.code;
    const carColorPrice = this.carFormGroup.controls.color.value?.price;
    const carColorDescription =
      this.carFormGroup.controls.color.value?.description;

    this.selectedCar.update((prev) => {
      const updatedValue: SelectedCar = {
        ...prev,
        model: {
          code: carModel?.code ?? prev.model.code,
          description: carModel?.description ?? prev.model.description,
        },
        color: {
          code: carColorCode ?? prev.color.code,
          price: carColorPrice ?? prev.color.price,
          description: carColorDescription ?? prev.color.description,
        },
      };

      return updatedValue;
    });
  }

  compareFn(obj1: CarColors, obj2: CarColors) {
    if (obj1 == null || obj2 == null) {
      return obj1 === obj2;
    }
    return obj1.description === obj2.description;
  }
}
