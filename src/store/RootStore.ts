import { types, flow } from 'mobx-state-tree';
import { api } from '../api/api';
import type { ApiMeterData } from '../types/apiTypes';

export const RootStore = types
  .model('RootStore', {
    meters: types.array(types.frozen<ApiMeterData>()),
    areasCache: types.map(types.string),
  })
  .actions((self) => {
    const getAreas = flow(function* (currentData: ApiMeterData[]) {
      const uniqAreaIds = [...new Set(currentData.map((el) => el.area.id))];
      const neededIds = uniqAreaIds.filter((id) => !self.areasCache.has(id));
      
      for (const id of neededIds) {
        const area = yield api.getAreas(id);
        self.areasCache.set(id, `${area.house.address}, ${area.str_number_full}`);
      }
    });

    return {
      getMeters: flow(function* () {
        const res = yield api.getMeters();
        yield getAreas(res.results);
        self.meters = res.results;
      }),
      getAddress(id: string) {
        return self.areasCache.get(id) || '';
      },
    };
  });
