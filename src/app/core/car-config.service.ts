import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import {
  CarConfig,
  CarConfigDetails,
  CarModel,
  SelectedCar,
} from '../models/cars.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarConfigService {
  http = inject(HttpClient);

  carModels$: Observable<CarModel[]> = this.http.get<CarModel[]>('/models');

  //We create a signal to set the value and a readonly signal to read it from our step2 component
  carConfig: WritableSignal<CarConfig> = signal({});

  selectedCar: WritableSignal<SelectedCar> = signal({
    model: {
      code: '',
      description: '',
    },
    color: {
      code: '',
      description: '',
      price: 0,
    },
    config: {
      id: 0,
      description: '',
      price: 0,
      range: 0,
      speed: 0,
    },
  });

  getCarConfig(code: string): Observable<CarConfigDetails> {
    return this.http.get<CarConfigDetails>(`/options/${code}`);
  }
}
