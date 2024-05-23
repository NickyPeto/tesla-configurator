import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StepperComponent } from './features/stepper/stepper.component';
import { CarPictureComponent } from './shared/car-picture/car-picture.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    RouterOutlet,
    StepperComponent,
    CarPictureComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = 'Angular';
}
