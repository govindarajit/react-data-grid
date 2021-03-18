import { memo } from 'react';
import clsx from 'clsx';

import { groupRowClassname, groupRowSelectedClassname, rowClassname, rowSelectedClassname } from './style';
import { SELECT_COLUMN_KEY } from './Columns';
import GroupCell from './GroupCell';
import type { CalculatedColumn, Position, Omit } from './types';
import { RowSelectionProvider } from './hooks';

export interface GroupRowRendererProps<R, SR = unknown> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  id: string;
  groupKey: unknown;
  viewportColumns: readonly CalculatedColumn<R, SR>[];
  childRows: readonly R[];
  rowIdx: number;
  top: number;
  level: number;
  selectedCellIdx?: number;
  isExpanded: boolean;
  isRowSelected: boolean;
  selectCell: (position: Position, enableEditor?: boolean) => void;
  toggleGroup: (expandedGroupId: unknown) => void;
}

function GroupedRow<R, SR>({
  id,
  groupKey,
  viewportColumns,
  childRows,
  rowIdx,
  top,
  level,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectCell,
  toggleGroup,
  ...props
}: GroupRowRendererProps<R, SR>) {
  // Select is always the first column
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;

  function selectGroup() {
    selectCell({ rowIdx, idx: -1 });
  }

  return (
    <RowSelectionProvider value={isRowSelected}>
      <div
        role="row"
        aria-level={level}
        aria-expanded={isExpanded}
        className={clsx(
          rowClassname,
          groupRowClassname,
          `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`, {
            [rowSelectedClassname]: isRowSelected,
            [groupRowSelectedClassname]: selectedCellIdx === -1 // Select row if there is no selected cell
          }
        )}
        onClick={selectGroup}
        style={{ top }}
        {...props}
      >
        {viewportColumns.map(column => (
          <GroupCell<R, SR>
            key={column.key}
            id={id}
            rowIdx={rowIdx}
            groupKey={groupKey}
            childRows={childRows}
            isExpanded={isExpanded}
            isCellSelected={selectedCellIdx === column.idx}
            column={column}
            groupColumnIndex={idx}
            toggleGroup={toggleGroup}
          />
        ))}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(GroupedRow) as <R, SR>(props: GroupRowRendererProps<R, SR>) => JSX.Element;
