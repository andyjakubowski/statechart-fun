import React from 'react';

const getIsHorizontallyResizable = function getIsHorizontallyResizable(
  element,
  stackType
) {
  if (!React.isValidElement(element)) {
    return false;
  }

  if (element.type.name === 'Spacer' && stackType === 'HStack') {
    return true;
  }

  return (
    element.props.horizontallyResizable === 'true' ||
    !!element.props.horizontallyResizable ||
    !!element.props.resizable
  );
};

const getIsVerticallyResizable = function getIsVerticallyResizable(
  element,
  stackType
) {
  if (!React.isValidElement(element)) {
    return false;
  }

  if (element.type.name === 'Spacer' && stackType === 'VStack') {
    return true;
  }

  return (
    element.props.verticallyResizable === 'true' ||
    !!element.props.verticallyResizable ||
    !!element.props.resizable
  );
};

const getIsResizable = function getIsResizable(element, _) {
  if (!React.isValidElement(element)) {
    return false;
  }

  return (
    element.type.name === 'Spacer' ||
    element.props.resizable === 'true' ||
    !!element.props.resizable
  );
};

const isSpacer = function isSpacer(element) {
  if (!React.isValidElement(element)) {
    return false;
  }

  return !!element.type.name && element.type.name === 'Spacer';
};

const isStack = function isStack(element) {
  if (!React.isValidElement(element)) {
    return false;
  }

  return (
    !!element.type.name &&
    ['HStack', 'VStack', 'ZStack'].includes(element.type.name)
  );
};

const isReactComponent = function isReactComponent(element) {
  if (!React.isValidElement(element)) {
    return false;
  }

  return typeof element.type === 'function';
};

const getResizabilityClassNameModifier = function getResizabilityClassNameModifier(
  isHorizontallyResizable,
  isVerticallyResizable,
  prefix = null
) {
  const prefixPart = prefix === null ? '_' : `_${prefix}-`;
  if (isHorizontallyResizable && isVerticallyResizable) {
    return `${prefixPart}resizable`;
  } else if (isHorizontallyResizable) {
    return `${prefixPart}horizontally-resizable`;
  } else if (isVerticallyResizable) {
    return `${prefixPart}vertically-resizable`;
  } else {
    return null;
  }
};

const getStackClassName = function getStackClassName(
  isStackHorizontallyResizable,
  isStackVerticallyResizable,
  classNameProp,
  stackType
) {
  const modifier = getResizabilityClassNameModifier(
    isStackHorizontallyResizable,
    isStackVerticallyResizable
  );
  const modifierClassName = modifier ? [stackType, modifier].join('') : null;
  return [stackType, modifierClassName, classNameProp].join(' ');
};

const getItemClassName = function getItemClassName(
  isItemHorizontallyResizable,
  isItemVerticallyResizable,
  baseClassName,
  item
) {
  const modifier = getResizabilityClassNameModifier(
    isItemHorizontallyResizable,
    isItemVerticallyResizable
  );
  const modifierClassName = modifier
    ? [baseClassName, modifier].join('')
    : null;
  const spacerClassName = isSpacer(item) ? 'Spacer' : null;
  return [baseClassName, modifierClassName, spacerClassName].join(' ');
};

const getItemContentClassName = function getItemContentClassName(
  isItemHorizontallyResizable,
  isItemVerticallyResizable,
  baseClassName,
  classNameProp
) {
  const modifier = getResizabilityClassNameModifier(
    isItemHorizontallyResizable,
    isItemVerticallyResizable
  );
  const modifierClassName = modifier
    ? [baseClassName, modifier].join('')
    : null;
  return [baseClassName, modifierClassName, classNameProp].join(' ');
};

const getStackStyle = function getStackStyle(
  styleProp,
  spacing,
  alignment,
  padding
) {
  const stackStyle = {
    '--spacing': `${spacing}px`,
    '--alignment': `var(--alignment-${alignment})`,
    '--padding': `${padding}px`,
  };
  return styleProp ? { ...stackStyle, ...styleProp } : stackStyle;
};

export {
  getIsHorizontallyResizable,
  getIsVerticallyResizable,
  getIsResizable,
  isStack,
  isReactComponent,
  getResizabilityClassNameModifier,
  getStackClassName,
  getItemClassName,
  getItemContentClassName,
  getStackStyle,
};
