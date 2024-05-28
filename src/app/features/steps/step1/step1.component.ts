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
    console.log(
      this.carFormGroup.controls.color.pristine,
      this.selectedCar().color.code,
      'on init'
    );
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
          if (this.carFormGroup.controls.color.pristine) {
            this.carFormGroup.controls.color.patchValue(model.colors[findI]);
          } else {
            this.carFormGroup.controls.color.patchValue(
              this.selectedCar().color
            );
          }
          console.log('patched input', this.carFormGroup.controls.color.value);

          this.selectedCar.update((prev) => {
            const updatedVal: SelectedCar = {
              ...prev,
              color: prev.color.code === '' ? model.colors[findI] : prev.color,
            };
            console.log(updatedVal);
            return updatedVal;
          });

          console.log(this.selectedCar().color, 'in selected car');
        }
      });
  }

  saveCarData() {
    this.carFormGroup.controls.model.valueChanges.subscribe((v) =>
      this.carFormGroup.controls.color.markAsPristine()
    );

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
