import {
  ChangeDetectorRef,
  Component,
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
import { CarModel, CarsModel, SelectedCar } from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './step1.component..html',
  styleUrl: './step1.component.scss',
})
export class Step1Component implements OnDestroy {
  cancellation = new Subject<void>();
  carModels: Signal<CarModel[]> = signal([]);
  selectedCar: WritableSignal<SelectedCar>;

  carFormGroup = new FormGroup({
    model: new FormControl<CarsModel>('S'),
    color: new FormControl<string>(''),
  });

  constructor(private carsService: CarConfigService, private router: Router) {
    this.carModels = this.carsService.compSignal();
    this.selectedCar = this.carsService.selectedCar;
  }

  ngOnDestroy(): void {
    this.cancellation.next();
    this.cancellation.complete();
  }

  getCars() {
    this.carsService.getCarsModel();
    //   .pipe(takeUntil(this.cancellation))
    //   .subscribe((v) => this.carModels.set(v));
  }

  getCarImgPath(model: string, color: string) {
    console.log(model, color, `../../../../assets/${model}/${color}.jpg`);
    return `../../../../assets/${model}/${color}.jpg`;
  }

  saveCarData() {
    this.carsService.selectedCar.update((value) => {
      const updatedValue: SelectedCar = {
        model: this.carFormGroup.controls.model.value ?? value.model,
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
