import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { rootStore } from '../main';
import { tableHeaders } from '../types/common';

export const Meters = observer(() => {
  useEffect(() => {
    rootStore.getMeters();
  }, []);

  if (rootStore.loading) return <div>Загрузка...</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((el) => (
              <th key={el}>{el}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rootStore.meters.map((el) => (
            <tr key={el.id}>
              <td>{el.serial_number}</td>
              <td>
                {el._type.includes('ColdWaterAreaMeter') ? 'ХВС' : 'ГВС'}
              </td>
              <td>
                {new Date(el.installation_date).toLocaleDateString()}
              </td>
              <td>{el.is_automatic ? 'Да' : 'Нет'}</td>
              <td>{el.initial_values}</td>
              <td>{rootStore.getAddress(el.area.id)}</td>
              <td>{el.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
