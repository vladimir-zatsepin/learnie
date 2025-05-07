import { extendTheme } from '@chakra-ui/react'

// Define the colors for our theme
const colors = {
  brand: {
    50: '#EBF4FF',
    100: '#C3DAFE',
    200: '#A3BFFA',
    300: '#7F9CF5',
    400: '#667EEA',
    500: '#5A67D8',
    600: '#4C51BF',
    700: '#434190',
    800: '#3C366B',
    900: '#302D41',
  },
  accent: {
    50: '#FFF5F7',
    100: '#FED7E2',
    200: '#FBB6CE',
    300: '#F687B3',
    400: '#ED64A6',
    500: '#D53F8C',
    600: '#B83280',
    700: '#97266D',
    800: '#702459',
    900: '#521B41',
  },
}

// Define the fonts for our theme
const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
}

// Define the global styles
const styles = {
  global: {
    body: {
      color: 'gray.800',
    },
  },
}

// Define the component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
}

// Create the theme
const theme = extendTheme({
  colors,
  fonts,
  styles,
  components,
})

export default theme
