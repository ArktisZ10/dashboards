import { useAtomValue } from 'jotai'
import { themeAtom } from '../store'

export function useThemeMode() {
  return useAtomValue(themeAtom)
}
