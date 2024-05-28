import {
  ChangeDetectorRef,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarConfigDetails,
  Configs,
  SelectedCar,
} from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject } from 'rxjs';
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
  changeDet = inject(ChangeDetectorRef);
  cancellation = new Subject<void>();
  selectedCar: WritableSignal<SelectedCar> = this.carService.selectedCar;
  carConfig$!: Observable<CarConfigDetails>;

  carConfigFormGroup = new FormGroup({
    config: new FormControl<Configs | null>(null),
    towHitch: new FormControl<boolean>(false),
    yoke: new FormControl<boolean>(false),
  });

  ngOnInit(): void {
    this.selectedCar().config.description !== ''
      ? this.carConfigFormGroup.controls.config.patchValue(
          this.selectedCar().config
        )
      : null;

    if (this.selectedCar().model.code) {
      this.carConfig$ = this.carService.getCarConfig(
        this.selectedCar().model.code
      );
    }

    this.changeDet.detectChanges();
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
        yoke: yokeSelected! ?? false,
        towHitch: towHitch! ?? false,
      };
      console.log(updatedObject, 'updated object');
      return updatedObject;
    });
  }

  compareFn(obj1: Configs, obj2: Configs): boolean {
    if (obj1 == null || obj2 == null) {
      return obj1 === obj2;
    }
    return obj1.id === obj2.id;
  }
}
