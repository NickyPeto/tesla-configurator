import { Component, inject, WritableSignal } from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import { SelectedCar } from '../../../models/cars.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.scss',
})
export class Step3Component {
  carService = inject(CarConfigService);
  selectedCar: WritableSignal<SelectedCar> = this.carService.selectedCar;

  totalCost(): number {
    let sumCost: number = this.selectedCar().config?.price ?? 0;
    if (this.selectedCar().towHitch) {
      sumCost = sumCost + 1000;
    }
    if (this.selectedCar().yoke) {
      sumCost = sumCost + 1000;
    }
    if (this.selectedCar().color.price > 0) {
      sumCost = sumCost + this.selectedCar().color.price;
    }
    return sumCost;
  }
}
