import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CarConfigService } from '../../../core/car-config.service';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './step1.component..html',
  styleUrl: './step1.component.scss',
  providers: [CarConfigService],
})
export class Step1Component implements OnInit {
  carFormGroup = new FormGroup({
    model: new FormControl(''),
    color: new FormControl(''),
  });

  constructor(private carsService: CarConfigService) {}

  ngOnInit(): void {
    this.carsService.getCarsModel();
  }
}
