import React from 'react';
import {Button, ButtonProps} from '@chakra-ui/react';
import {CircleLoader} from 'react-spinners';

interface LoadingButtonProps extends ButtonProps {
  loaderSize?: number;
  loaderColor?: string;
}

/**
 * A button component that shows a CircleLoader from react-spinners when in loading state
 * Used specifically for buttons that generate AI content
 */
const LoadingButton: React.FC<LoadingButtonProps> = ({
                                                       loaderSize = 20,
                                                       loaderColor,
                                                       children,
                                                       ...props
                                                     }) => {
  return (
    <Button
      {...props}
      spinner={<CircleLoader size={loaderSize} color={loaderColor || 'white'}/>}
    >
      {children}
    </Button>
  );
};

export default LoadingButton;
