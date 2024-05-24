//TODO: SPLIT THIS INTO DIFFERENT FILES
export interface CarModel {
  code: CarsModel;
  description: string;
  colors: CarColors[];
}

export type CarsModel = 'X' | 'S' | 'C' | '3' | 'Y' | '';

export type CarColors = {
  code: string;
  description: string;
  price: number;
};

export interface SelectedCar {
  model: CarsModel;
  color: string;
  config: string;
  price: number;
  yoke?: string;
  towHitch?: string;
}

export interface Configs {
  id: number;
  description: string;
  range: number;
  speed: number;
  price: number;
}

export interface CarConfig {
  [key: string]: CarConfigDetails;
}

export interface CarConfigDetails {
  configs: Configs[];
  towHitch: boolean;
  yoke: boolean;
}
