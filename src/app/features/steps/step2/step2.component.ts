import {
  ChangeDetectorRef,
  Component,
  inject,
  WritableSignal,
} from '@angular/core';
import { CarConfigService } from '../../../core/car-config.service';
import {
  CarConfigDetails,
  Configs,
  SelectedCar,
} from '../../../models/cars.model';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject, takeUntil } from 'rxjs';
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
  carConfig$: Observable<CarConfigDetails> = this.carService.getCarConfig(
    this.selectedCar().model.code
  );

  carConfigFormGroup = new FormGroup({
    config: new FormControl<Configs | null>(null),
    towHitch: new FormControl<boolean>(false),
    yoke: new FormControl<boolean>(false),
  });

  ngOnInit(): void {
    this.carConfig$
      .pipe(
        takeUntil(this.cancellation),
        map((value) => {
          this.carConfigFormGroup.controls.config.patchValue(value.configs[0]);
          this.carConfigFormGroup.controls.towHitch.patchValue(false);
          this.carConfigFormGroup.controls.yoke.patchValue(false);
        })
      )
      .subscribe((val) => console.log(val));
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
