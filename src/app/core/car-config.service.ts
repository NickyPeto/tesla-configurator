import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  OnInit,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  CarColors,
  CarConfig,
  CarModel,
  SelectedCar,
} from '../models/cars.model';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarConfigService implements OnInit {
  http = inject(HttpClient);

  carModels$: Observable<CarModel[]> = this.http.get<CarModel[]>('/models');

  //We save this value in a signal so that we can easily update its value and use it without the need for an observable
  selectedCarColor = signal<string | null>('');

  //We create a signal to set the value and a readonly signal to read it from our step2 component
  carConfig: WritableSignal<CarConfig> = signal({});
  // computedCarConfig = computed(() => this.carModels);

  selectedCar: WritableSignal<SelectedCar> = signal({
    model: 'X',
    color: '',
    price: 0,
    config: '',
  });

  ngOnInit(): void {
    console.log(this.selectedCar(), 'in service');
  }

  getCarConfig(code: string): Observable<CarConfig> {
    return this.http.get<CarConfig>(`/options/${code}`);
  }
}
