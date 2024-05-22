import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  providers: [Router],
})
export class StepperComponent {
  constructor(private router: Router) {}
  selectStep(step: number) {
    this.router.navigate(['/step', step]);
  }
}
