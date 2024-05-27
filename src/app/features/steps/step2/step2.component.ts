import { Component, OnInit, WritableSignal } from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarConfigDetails,
  Configs,
  SelectedCar,
} from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.scss',
})
export class Step2Component implements OnInit {
  carConfigFormGroup = new FormGroup({
    config: new FormControl<Configs>({
      id: -1,
      description: '',
      range: -1,
      speed: -1,
      price: -1,
    }),
    towHitch: new FormControl<boolean>(false),
    yoke: new FormControl<boolean>(false),
  });

  cancellation = new Subject<void>();
  selectedCar: WritableSignal<SelectedCar>;
  carConfig$: Observable<CarConfigDetails>;

  constructor(private carService: CarConfigService) {
    this.selectedCar = this.carService.selectedCar;
    this.carConfig$ = this.carService.getCarConfig(this.selectedCar().model);
  }

  ngOnInit(): void {
    console.log(this.selectedCar(), 'In step 2');
    this.carConfig$.subscribe((config) => {
      // Initialize form with the first config
      if (config.configs.length > 0) {
        this.carConfigFormGroup.patchValue({
          config: config.configs[0],
          towHitch: config.towHitch,
          yoke: config.yoke,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.cancellation.next();
    this.cancellation.complete();
  }

  saveCarData() {
    const selectedConfig = this.carConfigFormGroup.controls.config.value;
    const yokeSelected = this.carConfigFormGroup.controls.yoke.value;
    const towHitch = this.carConfigFormGroup.controls.towHitch.value;
    this.selectedCar.update((value) => {
      const updatedObject: SelectedCar = {
        ...value,
        config: selectedConfig ?? value.config,
        yoke: yokeSelected ?? value.yoke,
        towHitch: towHitch ?? value.towHitch,
      };

      return updatedObject;
    });

    console.log('Selected Config:', selectedConfig);
  }
}
