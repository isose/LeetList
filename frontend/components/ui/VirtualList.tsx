import { Draggable, type DraggableProvided, type DraggableStateSnapshot } from '@hello-pangea/dnd';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, VariableSizeList as List } from 'react-window';

const VirtualList = ({ items, component, props, droppableProvided }: any) => {
  const listRef = useRef<any>({});
  const rowHeights = useRef<any>({});

  const getRowHeight = useCallback(
    (index: number) => {
      return rowHeights.current[index] || 0;
    },
    [rowHeights],
  );

  const setRowHeight = useCallback(
    (index: number, size: number) => {
      listRef.current.resetAfterIndex(0);
      rowHeights.current = { ...rowHeights.current, [index]: size };
    },
    [listRef, rowHeights],
  );

  return (
    <AutoSizer>
      {({ height, width }: any) => (
        <List
          itemData={{
            items: items,
            component: component,
            props: props,
            setRowHeight: setRowHeight,
            isDraggable: droppableProvided !== undefined,
          }}
          itemCount={items.length}
          itemSize={getRowHeight}
          height={height}
          width={width}
          ref={listRef}
          outerRef={droppableProvided ? droppableProvided.innerRef : undefined}
        >
          {MemoizedRow}
        </List>
      )}
    </AutoSizer>
  );
};

const Row = ({ data, index, style }: any) => {
  const { items, component, setRowHeight, isDraggable } = data;
  const item = items[index];
  const ref = useRef<any>({});
  const props = { ref, ...data.props };

  useEffect(() => {
    if (ref.current && Object.keys(ref.current).length !== 0) {
      setRowHeight(index, ref.current.scrollHeight);
    }
  }, [ref]);

  return isDraggable ? (
    <Draggable draggableId={item.questionId} index={index} key={item.questionId}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return component({
          item,
          index,
          style: { margin: 0, ...style },
          props,
          provided,
          isDragging: snapshot.isDragging,
        });
      }}
    </Draggable>
  ) : (
    component({ item, index, style, props })
  );
};

const MemoizedRow = memo(Row, areEqual);

export default VirtualList;
