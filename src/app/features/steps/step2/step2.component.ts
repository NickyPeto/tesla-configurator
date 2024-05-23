import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import { SelectedCar } from '../../../models/cars.model';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class Step2Component implements OnInit {
  selectedCar: WritableSignal<SelectedCar>;
  constructor(private carService: CarConfigService) {
    this.selectedCar = this.carService.selectedCar;
  }

  ngOnInit(): void {
    console.log(this.selectedCar(), 'selected car');
  }
}
