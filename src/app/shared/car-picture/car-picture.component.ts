import { Component, computed } from '@angular/core';
import { CarConfigService } from '../../core/car-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-picture.component.html',
  styleUrl: './car-picture.component.scss',
})
export class CarPictureComponent {
  selectedCar = computed(() => this.carService.selectedCar());

  constructor(private carService: CarConfigService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.getCarImgPath();
  }

  getCarImgPath() {
    if (this.selectedCar().color.code !== '') {
      return `../../../../assets/${this.selectedCar().model.code}/${
        this.selectedCar().color.code
      }.jpg`;
    }
    return;
  }
}
