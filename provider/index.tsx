import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { useColorScheme } from 'react-native'
import { TamaguiProviderProps, TamaguiProvider } from 'tamagui'
import { AuthProvider } from './auth'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()
  return (
    <TamaguiProvider
      config={config}
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <NavigationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NavigationProvider>
    </TamaguiProvider>
  )
}
