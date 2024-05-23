import {
  Component,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import { CarConfig, SelectedCar } from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class Step2Component implements OnInit {
  cancellation = new Subject<void>();
  selectedCar: WritableSignal<SelectedCar>;
  carConfig$: Observable<CarConfig>;
  constructor(private carService: CarConfigService) {
    this.selectedCar = this.carService.selectedCar;
    // this.carConfig = this.carService.computedCarConfig()
    this.carConfig$ = this.carService.getCarConfig(this.selectedCar().model);
  }

  ngOnInit(): void {
    this.carConfig$
      .pipe(takeUntil(this.cancellation))
      .subscribe((v) => console.log(v));
  }

  ngOnDestroy(): void {
    this.cancellation.next();
    this.cancellation.complete();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
