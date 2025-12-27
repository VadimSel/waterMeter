import type { ApiAreasTypes, ApiResultsTypes } from '../types/apiTypes';

const BASE = '/c300/api/v4/test/';

export const api = {
  getMeters: async (): Promise<ApiResultsTypes> => {
    const res = await fetch(`${BASE}meters/?limit=20&offset=20`, {
      method: 'GET',
    });
    const data = await res.json();
    return data;
  },

  getAreas: async (id: string): Promise<ApiAreasTypes> => {
    const res = await fetch(`${BASE}areas/?id=${id}`, {
      method: "GET",
    })
    const data = await res.json()
    return data.results[0];
  }
};
