import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarConfigService {
  constructor(private http: HttpClient) {}

  getCarsModel() {
    this.http.get('/models').subscribe((v) => console.log(v));
  }
}
