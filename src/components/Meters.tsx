import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styled from 'styled-components';
import ColdIcon from '../assets/cold.svg';
import HotIcon from '../assets/hot.svg';
import TrashHover from '../assets/trash-hover.svg';
import TrashNormal from '../assets/trash-normal.svg';
import { rootStore } from '../main';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TableWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
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
`;

const Th = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #424242;
  &:first-child {
    width: 60px;
  }
  &:nth-child(2) {
    width: 80px;
  }
`;

const Tr = styled.tr`
  &:hover {
    background: #f9f9f9;
  }
`;

const Td = styled.td`
  padding: 16px 12px;
  border-top: 1px solid #e0e0e0;
  font-size: 14px;
  color: #212121;
  vertical-align: middle;
`;

const NumberCell = styled(Td)`
  color: #757575;
  font-weight: 500;
`;

const TypeCell = styled(Td)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  opacity: 0;
  ${Tr}:hover & {
    opacity: 1;
  }
`;

const TrashNormalIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const TrashHoverIcon = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 8px;
  left: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  ${Tr}:hover & {
    opacity: 1;
  }
`;

const DeleteWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
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
  const {
    meters,
    loadMeters,
    getAddress,
    visiblePages,
    currentPage,
    setPage,
  } = rootStore;

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
              <Th>Значение</Th>
              <Th>Адрес</Th>
              <Th>Примечание</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {meters.map((el, index) => (
              <Tr key={el.id}>
                <NumberCell>{index + 1 + rootStore.offset}</NumberCell>
                <TypeCell>
                  <Icon
                    src={el._type.includes('Cold') ? ColdIcon : HotIcon}
                    alt={el._type.includes('Cold') ? 'ХВС' : 'ГВС'}
                  />
                  {el._type.includes('Cold') ? 'ХВС' : 'ГВС'}
                </TypeCell>
                <Td>{new Date(el.installation_date).toLocaleDateString('ru-RU')}</Td>
                <Td>
                  <Icon
                    alt={el.is_automatic ? 'Да' : 'Нет'}
                  />
                </Td>
                <Td>{el.initial_values}</Td>
                <Td>{getAddress(el.area.id)}</Td>
                <Td>{el.description}</Td>
                <Td>
                  <DeleteButton>
                    <DeleteWrapper>
                      <TrashNormalIcon src={TrashNormal} alt="Удалить" />
                      <TrashHoverIcon src={TrashHover} alt="Удалить" />
                    </DeleteWrapper>
                  </DeleteButton>
                </Td>
              </Tr>
            ))}
          </tbody>
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