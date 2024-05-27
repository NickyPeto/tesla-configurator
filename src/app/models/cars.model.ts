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
  config?: Configs;
  yoke?: boolean;
  towHitch?: boolean;
}

export interface Configs {
  id: number | undefined;
  description: string | undefined;
  range: number | undefined;
  speed: number | undefined;
  price: number | undefined;
}

export interface CarConfig {
  [key: string]: CarConfigDetails;
}

export interface CarConfigDetails {
  configs: Configs[];
  towHitch: boolean;
  yoke: boolean;
}
