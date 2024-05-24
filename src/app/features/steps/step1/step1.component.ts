import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarColors,
  CarModel,
  CarsModel,
  SelectedCar,
} from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import { filter, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

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

  selectedModelColors: CarColors[] = [];

  carFormGroup = new FormGroup({
    model: new FormControl<CarsModel | string>('choose'),
    color: new FormControl<string>('white'),
  });

  constructor(private carsService: CarConfigService, private router: Router) {
    this.carModels$ = this.carsService.carModels$;
    this.selectedCar = this.carsService.selectedCar;
  }

  ngOnInit(): void {
    this.getSelectedCarColors();
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
        map((modelCode) => {
          if (this.carModels$) {
            return this.carModels$.pipe(
              map((models) => models.find((model) => model.code === modelCode))
            );
          } else return of();
        })
      )
      .subscribe((model$) => {
        model$.pipe(takeUntil(this.cancellation)).subscribe((model) => {
          if (model) {
            this.selectedModelColors = model.colors;
            console.log(this.carFormGroup.controls.color.value);
            this.carsService.selectedCarColor.set(
              this.carFormGroup.controls.color.value
            );
          } else {
            this.selectedModelColors = [];
          }
        });
      });
  }

  saveCarData() {
    this.carsService.selectedCar.update((value) => {
      const updatedValue: SelectedCar = {
        model: (this.carFormGroup.controls.model.value ??
          value.model) as CarsModel,
        color: this.carFormGroup.controls.color.value ?? value.color,
        config: value.config,
        price: value.price,
      };
      console.log(
        {
          ...value,
          ...updatedValue,
        },
        'in updated signal'
      );
      return updatedValue;
    });
  }
}
