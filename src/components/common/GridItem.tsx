import React from 'react';
import { Grid } from '@mui/material';

interface GridItemProps {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  container?: boolean;
  item?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  spacing?: number;
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'space-between' | 'space-around';
}

/**
 * A memoized Grid item component with proper TypeScript support.
 * Wraps MUI Grid with item prop set to true and includes proper typing.
 */
export const GridItem = React.memo(({ children, ...props }: GridItemProps) => {
  const gridProps = { ...props };
  gridProps.item = true;
  
  return (
    <Grid {...gridProps}>
      {children}
    </Grid>
  );
});

GridItem.displayName = 'GridItem';

export default GridItem;
