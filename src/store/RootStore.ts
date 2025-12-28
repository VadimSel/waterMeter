import { types, flow } from 'mobx-state-tree';
import { api } from '../api/api';
import type { ApiMeterData } from '../types/apiTypes';

const PAGE_SIZE = 20;

export const RootStore = types
  .model('RootStore', {
    meters: types.array(types.frozen<ApiMeterData>()),
    areasCache: types.map(types.string),
    offset: types.number,
    total: types.number,
  })
  .views((self) => ({
    get totalPages() {
      return Math.ceil(self.total / 20);
    },
    get currentPage() {
      return self.offset / 20 + 1;
    },
    get visiblePages() {
  const pages: number[] = [];
  const last = this.totalPages;
  const current = this.currentPage;

  if (current < 3) {
    for (let i = 1; i <= 3 && i <= last; i++) {
      pages.push(i);
    }
  } else {
    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 0 && i <= last) pages.push(i);
    }
  }
  for (let i = last - 2; i <= last; i++) {
    if (i > 0 && !pages.includes(i)) {
      pages.push(i);
    }
  }

  return pages.sort((a, b) => a - b);
}

  }))
  .actions((self) => {
    const getAreas = flow(function* (currentData: ApiMeterData[]) {
      const uniqIds = [...new Set(currentData.map((el) => el.area.id))];
      const neededIds = uniqIds.filter((id) => !self.areasCache.has(id));

      for (const id of neededIds) {
        const area = yield api.getAreas(id);
        self.areasCache.set(
          id,
          `${area.house.address}, ${area.str_number_full}`
        );
      }
    });

    const loadMeters = flow(function* () {
      const res = yield api.getMeters(PAGE_SIZE, self.offset);
      self.total = res.count;
      yield getAreas(res.results);
      self.meters = res.results;
    });

    return {
      loadMeters,
      setPage(page: number) {
        self.offset = (page - 1) * PAGE_SIZE;
        loadMeters();
      },
      getAddress(id: string) {
        return self.areasCache.get(id);
      },
    };
  });
