import { Component, inject, WritableSignal } from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarConfig,
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
export class Step2Component {
  carService = inject(CarConfigService);
  cancellation = new Subject<void>();
  selectedCar: WritableSignal<SelectedCar> = this.carService.selectedCar;
  carConfig$: Observable<CarConfigDetails> = this.carService.getCarConfig(
    this.selectedCar().model
  );

  carConfigFormGroup = new FormGroup({
    config: new FormControl<Configs | null>(this.selectedCar().config),
    towHitch: new FormControl<boolean>(this.selectedCar().towHitch ?? false),
    yoke: new FormControl<boolean>(this.selectedCar().yoke ?? false),
  });

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
        yoke: yokeSelected!,
        towHitch: towHitch!,
      };

      return updatedObject;
    });
  }

  compareFn(obj1: Configs, obj2: Configs) {
    return obj1.description === obj2.description;
  }
}
