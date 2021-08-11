import { DefaultTheme } from '@saladtechnologies/garden-components'
import '@saladtechnologies/garden-fonts'
import { ThemeProvider } from '@storybook/theming'

export const GardenTheme = ({ children }) => <ThemeProvider theme={DefaultTheme}>{children}</ThemeProvider>
