import { useAppEvents } from '$';
import { EventType } from '../constants';
import { useState } from 'react';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

/**
 * The example below demonstrates the potential implementation of the useTheme hook,
 * which allows getting and updating a theme from any component of the app.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);

  const { notifyEventListeners, listenForEvents } = useAppEvents<EventType>({
    debug: true,
  });

  // 1. If any other instance of the useTheme hook has its theme value updated
  listenForEvents(EventType.THEME_UPDATE, (themeNext: Theme) => {
    // 1.1. Synchronize the theme value of this instance, with a new one
    setTheme(themeNext);
  });

  const updateTheme = (themeNext: Theme) => {
    setTheme(themeNext);

    // 2. Notify all other useTheme hook instances about the changed value
    notifyEventListeners(EventType.THEME_UPDATE, themeNext);
  };

  return {
    theme,
    updateTheme,
  };
};
