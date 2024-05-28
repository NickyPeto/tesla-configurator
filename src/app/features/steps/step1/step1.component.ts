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
    model: new FormControl<CarsModel>('' || this.selectedCar().model),
    color: new FormControl<CarColors>(this.selectedCar().color),
  });

  constructor(private carsService: CarConfigService, private router: Router) {
    this.carModels$ = this.carsService.carModels$;
    this.selectedCar = this.carsService.selectedCar;
  }

  ngOnInit(): void {
    this.getSelectedCarColors();
    this.carModels$
      ?.pipe(
        map((v) =>
          v.filter((car) => car.code === this.carFormGroup.controls.model.value)
        )
      )
      .subscribe((v) => {
        this.selectedModelColors = v[0].colors;
      });
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
        if (model) this.selectedModelColors = model?.colors;
        console.log(this.selectedModelColors, 'on select car colors');
      });
  }

  saveCarData() {
    const carModel = this.carFormGroup.controls.model.value;
    const carColorCode = this.carFormGroup.controls.color.value?.code;
    const carColorPrice = this.carFormGroup.controls.color.value?.price;
    const carColorDescription =
      this.carFormGroup.controls.color.value?.description;

    this.carsService.selectedCar.update((prev) => {
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
    console.log(obj1, obj2, 'in compare function');
    return obj1.description === obj2.description;
  }
}
