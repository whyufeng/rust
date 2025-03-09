import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      // Modify default styles
      baseStyle: {
        borderRadius: '8px',
      },
      // Add new variants
      variants: {
        'custom': {
          bg: 'teal.500',
          color: 'white',
        }
      }
    }
  }
}); 