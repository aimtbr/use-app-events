import useGlobal from '$lib/useGlobal/useGlobal';
import { EventType } from '../constants';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

/**
 * The example below demonstrates the potential implementation of the useTheme hook,
 * which allows getting and updating a theme from any component of the app.
 */
export const useTheme = () => {
  const [theme, updateTheme] = useGlobal(EventType.THEME_UPDATE, Theme.DARK);

  return {
    theme,
    updateTheme,
  };
};
