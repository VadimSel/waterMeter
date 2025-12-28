import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { tableHeaders } from '../types/common';
import { rootStore } from '../main';

export const Meters = observer(() => {
  const { meters, loadMeters, getAddress, visiblePages, currentPage, setPage } =
    rootStore;

  useEffect(() => {
    loadMeters();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meters.map((m) => (
            <tr key={m.id}>
              <td>{m.serial_number}</td>
              <td>{m._type.includes('Cold') ? 'ХВС' : 'ГВС'}</td>
              <td>{new Date(m.installation_date).toLocaleDateString()}</td>
              <td>{m.is_automatic ? 'Да' : 'Нет'}</td>
              <td>{m.initial_values}</td>
              <td>{getAddress(m.area.id)}</td>
              <td>{m.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {visiblePages.map((page, index) => {
          const prev = visiblePages[index - 1];

          return (
            <span key={page}>
              {prev && page - prev > 1 && <span>...</span>}
              <button
                disabled={page === currentPage}
                onClick={() => setPage(page)}
              >
                {page}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
});
