import { Component, computed } from '@angular/core';
import { CarConfigService } from '../../core/car-config.service';

@Component({
  selector: 'app-car-picture',
  standalone: true,
  imports: [],
  templateUrl: './car-picture.component.html',
  styleUrl: './car-picture.component.scss',
})
export class CarPictureComponent {
  selectedCar = computed(() => this.carService.selectedCar());

  constructor(private carService: CarConfigService) {}

  getCarImgPath() {
    if (this.selectedCar().color.code)
      return `../../../../assets/${this.selectedCar().model}/${
        this.selectedCar().color.code
      }.jpg`;
    return;
  }
}
