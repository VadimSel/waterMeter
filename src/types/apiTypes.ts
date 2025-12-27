export type ApiResultsTypes = {
  count: number;
  next: string;
  previous: string;
  results: ApiMeterData[];
};

export type ApiMeterData = {
  _type: string;
  area: { id: string };
  brand_name: string;
  communication: string;
  description: string;
  id: string;
  initial_values: [];
  installation_date: string;
  is_automatic: boolean;
  model_name: string;
  serial_number: string;
};

export type ApiAreasTypes = {
  id: string;
  number: number;
  str_number: string;
  str_number_full: string;
  house: HouseTypes;
};

type HouseTypes = {
  address: string;
  id: string;
  fias_addrobjs: string[];
};
