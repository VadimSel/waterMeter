import { types, flow } from 'mobx-state-tree';
import { api } from '../api/api';
import type { ApiMeterData, ApiAreasTypes } from '../types/apiTypes';

const PAGE_SIZE = 20;

export const RootStore = types
  .model('RootStore', {
    meters: types.array(types.frozen<ApiMeterData>()),
    areasCache: types.map(types.string),
    offset: types.number,
    total: types.number,
    isLoading: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get totalPages() {
      return Math.max(1, Math.ceil(self.total / PAGE_SIZE));
    },
    get currentPage() {
      return Math.floor(self.offset / PAGE_SIZE) + 1;
    },
    get visiblePages() {
      const pages: number[] = [];
      const last = this.totalPages;
      const current = this.currentPage;

      for (let i = 1; i <= 3 && i <= last; i++) {
        pages.push(i);
      }

      for (let i = current - 1; i <= current + 1; i++) {
        if (i > 3 && i < last - 2) {
          pages.push(i);
        }
      }

      for (let i = last - 2; i <= last; i++) {
        if (i > 0) pages.push(i);
      }

      return [...new Set(pages)].sort((a, b) => a - b);
    },
  }))
  .actions((self) => {
    const loadAreas = flow(function* (meters: ApiMeterData[]) {
      const ids = Array.from(
        new Set(
          meters.map((m) => m.area.id).filter((id) => !self.areasCache.has(id))
        )
      );

      if (!ids.length) return;

      const areas: ApiAreasTypes[] = yield api.getAreas(ids);

      areas.forEach((area) => {
        self.areasCache.set(
          area.id,
          `${area.house.address}, кв. ${area.number}`
        );
      });
    });

    const loadMeters = flow(function* () {
      if (self.isLoading) return;
      self.isLoading = true;

      const res = yield api.getMeters(PAGE_SIZE, self.offset);

      self.total = res.count;
      self.meters = res.results;

      yield loadAreas(res.results);

      self.isLoading = false;
    });

    return {
      loadMeters,
      setPage(page: number) {
        const safePage = Math.min(
          Math.max(1, page),
          Math.max(1, Math.ceil(self.total / PAGE_SIZE))
        );

        self.offset = (safePage - 1) * PAGE_SIZE;
        loadMeters();
      },
      getAddress(id: string) {
        return self.areasCache.get(id) ?? '';
      },
    };
  });
