import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarColors,
  CarModel,
  CarsModel,
  SelectedCar,
} from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import {
  filter,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './step1.component..html',
  styleUrl: './step1.component.scss',
})
export class Step1Component implements OnDestroy {
  cancellation = new Subject<void>();
  carModels$: Observable<CarModel[]> | undefined;
  selectedCar: WritableSignal<SelectedCar> = this.carsService.selectedCar;

  selectedModelColors!: CarColors[];

  carFormGroup = new FormGroup({
    model: new FormControl<CarsModel | null>(null),
    color: new FormControl<CarColors>(this.selectedCar().color),
  });

  constructor(private carsService: CarConfigService, private router: Router) {
    this.carModels$ = this.carsService.carModels$;
    this.selectedCar = this.carsService.selectedCar;
  }

  ngOnInit(): void {
    //Here we will get the right array of colors programmatically
    this.getSelectedCarColors();
    this.selectedCar().model !== ''
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
              map((models) => models.find((model) => model.code === modelCode))
            );
          } else {
            return of();
          }
        })
      )
      .subscribe((model) => {
        console.log(model?.colors);
        if (model) {
          this.selectedModelColors = model?.colors;

          const findI = model.colors.findIndex(
            (color) => color.code === 'white'
          );
          const currentIndex = model.colors.findIndex(
            (color) => color.code === this.selectedCar().color.code
          );
          console.log(
            this.selectedCar().color,
            model.colors[findI],
            this.carFormGroup.controls.color.pristine,
            'in console log subscribe'
          );
          if (
            this.carFormGroup.controls.color.pristine ||
            !model.colors[currentIndex]
          ) {
            console.log('if', this.carFormGroup.controls.color.pristine);
            this.carFormGroup.controls.color.patchValue(model.colors[findI]);
          } else {
            console.log('else');
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

          console.log(this.selectedCar().color, 'in selected car');
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
        model: carModel ?? prev.model,
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
    return obj1.description === obj2.description;
  }
}
