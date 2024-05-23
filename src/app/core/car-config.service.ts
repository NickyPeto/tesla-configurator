import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  OnInit,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CarColors, CarModel, SelectedCar } from '../models/cars.model';

@Injectable({
  providedIn: 'root',
})
export class CarConfigService implements OnInit {
  carModels: WritableSignal<CarModel[]> = signal([]);
  compSignal = computed(() => this.carModels);
  selectedCar: WritableSignal<SelectedCar> = signal({
    model: 'X',
    color: '',
    price: 0,
    config: '',
  });

  constructor(private http: HttpClient) {
    effect(() => {
      console.log('com signal triggered', this.compSignal, this.carModels());
    });
  }

  ngOnInit(): void {
    console.log(this.selectedCar(), 'in service');
  }

  getCarsModel() {
    this.http.get<CarModel[]>('/models').subscribe((v: CarModel[]) => {
      this.carModels.set(v);
      console.log(v);
      return this.compSignal;
    });
  }
}
