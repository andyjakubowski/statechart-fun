import './Stacks.scss';
import React, { useState, useEffect, useCallback } from 'react';
import {
  getIsHorizontallyResizable,
  getIsVerticallyResizable,
  isReactComponent,
  getStackClassName,
  getItemClassName,
  getItemContentClassName,
  getStackStyle,
} from './stackUtil';

const Stack = function Stack({
  children,
  stackType,
  onResizableChange,
  itemId: stackId,
  alignment = 'center',
  spacing = '0',
  padding = '0',
  ...props
}) {
  const [
    isStackHorizontallyResizable,
    setIsStackHorizontallyResizable,
  ] = useState(null);
  const [isStackVerticallyResizable, setIsStackVerticallyResizable] = useState(
    null
  );
  const [
    horizontallyResizableItemIds,
    setHorizontallyResizableItemIds,
  ] = useState([]);
  const [verticallyResizableItemIds, setVerticallyResizableItemIds] = useState(
    []
  );
  const memoizedHandleResizableChange = useCallback(
    (isItemHorizontallyResizable, isItemVerticallyResizable, itemId) => {
      if (isItemHorizontallyResizable && !isStackHorizontallyResizable) {
        setIsStackHorizontallyResizable(true);
      }

      if (isItemVerticallyResizable && !isStackVerticallyResizable) {
        setIsStackVerticallyResizable(true);
      }

      if (
        isItemHorizontallyResizable &&
        !horizontallyResizableItemIds.includes(itemId)
      ) {
        setHorizontallyResizableItemIds([
          ...horizontallyResizableItemIds,
          itemId,
        ]);
      }

      if (
        isItemVerticallyResizable &&
        !verticallyResizableItemIds.includes(itemId)
      ) {
        setVerticallyResizableItemIds([...verticallyResizableItemIds, itemId]);
      }
    },
    [
      isStackHorizontallyResizable,
      isStackVerticallyResizable,
      horizontallyResizableItemIds,
      verticallyResizableItemIds,
    ]
  );
  useEffect(() => {
    const isStackResizableInEitherDimension =
      isStackHorizontallyResizable || isStackVerticallyResizable;
    if (isStackResizableInEitherDimension && !!onResizableChange) {
      onResizableChange(
        isStackHorizontallyResizable,
        isStackVerticallyResizable,
        stackId
      );
    }
  }, [
    isStackHorizontallyResizable,
    isStackVerticallyResizable,
    onResizableChange,
    stackId,
  ]);
  const items = React.Children.toArray(children).map((item, i) => {
    const itemBaseClassName = `${stackType}__item`;

    if (!React.isValidElement(item)) {
      return (
        <div className={itemBaseClassName} key={i}>
          {item}
        </div>
      );
    }

    const isItemHorizontallyResizable =
      horizontallyResizableItemIds.includes(i) ||
      getIsHorizontallyResizable(item, stackType);
    const isItemVerticallyResizable =
      verticallyResizableItemIds.includes(i) ||
      getIsVerticallyResizable(item, stackType);

    if (isStackHorizontallyResizable === null && isItemHorizontallyResizable) {
      setIsStackHorizontallyResizable(true);
    }

    if (isStackVerticallyResizable === null && isItemVerticallyResizable) {
      setIsStackVerticallyResizable(true);
    }

    const itemClassName = getItemClassName(
      isItemHorizontallyResizable,
      isItemVerticallyResizable,
      itemBaseClassName,
      item
    );
    const itemContentClassName = getItemContentClassName(
      isItemHorizontallyResizable,
      isItemVerticallyResizable,
      `${stackType}__item-content`,
      item.props.className
    );
    const {
      horizontallyResizable,
      verticallyResizable,
      resizable,
      ...strippedProps
    } = item.props;
    const additionalProps = isReactComponent(item)
      ? { onResizableChange: memoizedHandleResizableChange, itemId: i }
      : {};
    return (
      <div className={itemClassName} key={i}>
        {{
          ...item,
          props: {
            ...strippedProps,
            ...additionalProps,
            className: itemContentClassName,
          },
        }}
      </div>
    );
  });

  const stackClassName = getStackClassName(
    isStackHorizontallyResizable,
    isStackVerticallyResizable,
    props.className,
    stackType
  );
  const stackStyle = getStackStyle(props.style, spacing, alignment, padding);

  return (
    <div className={stackClassName} style={stackStyle}>
      {items}
    </div>
  );
};

const HStack = function HStack(props) {
  return <Stack {...props} stackType="HStack" />;
};

const VStack = function VStack(props) {
  return <Stack {...props} stackType="VStack" />;
};

const ZStack = function ZStack(props) {
  return <Stack {...props} stackType="ZStack" />;
};

const Spacer = function Spacer({ className }) {
  return <div className={className}></div>;
};

export { HStack, VStack, ZStack, Spacer };
