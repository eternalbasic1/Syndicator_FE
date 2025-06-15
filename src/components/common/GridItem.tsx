import React from 'react';
import { Grid, type GridProps as MuiGridProps } from '@mui/material';

// Extend MUI GridProps but make 'item' optional since we're setting it to true
type GridItemProps = Omit<MuiGridProps, 'item' | 'container'> & {
  xs?: number | 'auto' | true | false;
  sm?: number | 'auto' | true | false;
  md?: number | 'auto' | true | false;
  lg?: number | 'auto' | true | false;
  xl?: number | 'auto' | true | false;
};

/**
 * A memoized Grid item component with proper TypeScript support.
 * Wraps MUI Grid with item prop set to true and includes proper typing.
 */
const GridItem = React.memo<GridItemProps>(({ children, ...props }) => (
  <Grid item component="div" {...props}>
    {children}
  </Grid>
));

GridItem.displayName = 'GridItem';

export default GridItem;
