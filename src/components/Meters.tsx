import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { rootStore } from '../main';
import ColdIcon from '../assets/cold.svg';
import HotIcon from '../assets/hot.svg';
import TrashHover from '../assets/trash-hover.svg';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;

const TableWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  overflow-y: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
  height: 32px;
  font-weight: 500;
  font-size: 13px;
`;

const Tbody = styled.tbody`
  font-weight: 400;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  color: #697180;
  &:first-child {
    width: 60px;
    text-align: center;
  }
  &:nth-child(2) {
    width: 80px;
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  height: 52px;
  &:hover {
    background: #f9f9f9;
  }
`;

const Td = styled.td`
  color: #212121;
`;

const NumberCell = styled(Td)`
  color: #757575;
  text-align: center;
`;

const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0;
  width: 100%;
  height: 100%;
  ${Tr}:hover & {
    opacity: 1;
  }
`;

const TrashHoverIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 12px;
`;

const DeleteWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 12px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 24px 12px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  min-width: 36px;
  height: 36px;
  border: 1px solid ${({ active }) => (active ? '#1976d2' : '#e0e0e0')};
  background: ${({ active }) => (active ? '#1976d2' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#424242')};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  &:hover:not(:disabled) {
    background: ${({ active }) => (active ? '#1565c0' : '#f5f5f5')};
  }
`;

const Dots = styled.span`
  padding: 0 8px;
  color: #757575;
`;

export const Meters = observer(() => {
  const { meters, loadMeters, getAddress, visiblePages, currentPage, setPage } =
    rootStore;

  useEffect(() => {
    loadMeters();
  }, []);

  return (
    <Container>
      <TableWrapper>
        <StyledTable>
          <Thead>
            <tr>
              <Th>№</Th>
              <Th>Тип</Th>
              <Th>Дата установки</Th>
              <Th>Автоматический</Th>
              <Th>Текущие показания</Th>
              <Th>Адрес</Th>
              <Th>Примечание</Th>
              <Th></Th>
            </tr>
          </Thead>
          <Tbody>
            {meters.map((m, index) => (
              <Tr key={m.id}>
                <NumberCell>{index + 1 + rootStore.offset}</NumberCell>
                <Td>
                  <TypeWrapper>
                    <Icon
                      src={m._type.includes('Cold') ? ColdIcon : HotIcon}
                      alt={m._type.includes('Cold') ? 'ХВС' : 'ГВС'}
                    />
                    {m._type.includes('Cold') ? 'ХВС' : 'ГВС'}
                  </TypeWrapper>
                </Td>
                <Td>
                  {new Date(m.installation_date).toLocaleDateString('ru-RU')}
                </Td>
                <Td>{m.is_automatic ? 'Да' : 'Нет'}</Td>
                <Td>{m.initial_values}</Td>
                <Td>{getAddress(m.area.id)}</Td>
                <Td>{m.description}</Td>
                <Td>
                  <DeleteButton>
                    <DeleteWrapper>
                      <TrashHoverIcon src={TrashHover} alt="Удалить" />
                    </DeleteWrapper>
                  </DeleteButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </StyledTable>
      </TableWrapper>

      <Pagination>
        {visiblePages.map((page, i) => {
          const prev = visiblePages[i - 1];
          return (
            <span key={page}>
              {prev && page - prev > 1 && <Dots>...</Dots>}
              <PageButton
                active={page === currentPage}
                disabled={page === currentPage}
                onClick={() => setPage(page)}
              >
                {page}
              </PageButton>
            </span>
          );
        })}
      </Pagination>
    </Container>
  );
});
