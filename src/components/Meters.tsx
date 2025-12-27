import { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { ApiMeterData } from '../types/apiTypes';
import { tableHeaders } from '../types/common';

export const Meters = () => {
  const [meters, setMeters] = useState<ApiMeterData[]>([]);
  const [areasIds, setAreasIds] = useState<Record<string, string>>({});

  const getMeters = async () => {
    const res = await api.getMeters();
    await getAreas(res.results);
    setMeters(res.results);
  };

  const getAreas = async (currentData: ApiMeterData[]) => {
    const uniqAreaIds = [...new Set(currentData.map((el) => el.area.id))];
    const neededIds = uniqAreaIds.filter((id) => !(id in areasIds));

    neededIds.forEach(async (id) => {
      const area = await api.getAreas(id);
      setAreasIds((prev) => ({
        ...prev,
        [id]: `${area.house.address}, ${area.str_number_full}`,
      }));
    });
  };

  const getAddress = (areaId: string): string => {
    return areasIds[areaId];
  };

  useEffect(() => {
    const func = async () => {
      await getMeters();
    };
    func();
  }, []);

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
          {meters.map((el) => {
            return (
              <tr key={el.id}>
                <td>{el.serial_number}</td>
                <td>
                  {el._type.includes('ColdWaterAreaMeter') ? 'ХВС' : 'ГВС'}
                </td>
                <td>{new Date(el.installation_date).toLocaleDateString()}</td>
                <td>{el.is_automatic ? 'Да' : 'Нет'}</td>
                <td>{el.initial_values}</td>
                <td>{getAddress(el.area.id)}</td>
                <td>{el.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={() => api.getMeters()}>getMetters</button>
    </div>
  );
};
