//The model for the response from the /models endpoint
export interface CarModel {
  code: CarsModelCode;
  description: string;
  colors: CarColors[];
}

export type CarsModelCode = 'X' | 'S' | 'C' | '3' | 'Y' | '';

export type CarColors = {
  code: string;
  description: string;
  price: number;
};

//The model for the response from the /options /:code endpoint
export interface CarConfig {
  [key: string]: CarConfigDetails;
}

export interface CarConfigDetails {
  configs: Configs[];
  towHitch: boolean;
  yoke: boolean;
}

export interface Configs {
  id: number;
  description: string;
  range: number;
  speed: number;
  price: number;
}

//The model for the signal in which we will store the selected values
export interface SelectedCar {
  model: FormCarModel;
  color: CarColors;
  config: Configs;
  yoke?: boolean;
  towHitch?: boolean;
}

export type FormCarModel = {
  code: CarsModelCode;
  description: string;
};
