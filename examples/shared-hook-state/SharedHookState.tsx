import { Theme, useTheme } from './useTheme';

/**
 * The usage example of the useTheme hook.
 *
 * When either Sister or Brother component have their theme state changed,
 * they immediately notify the sibling to update their theme state too.
 */
export const SharedHookStateParent = () => {
  return (
    <div style={{ border: '1px solid lightgray', padding: '3rem' }}>
      <h2>Shared Hook State</h2>
      <hr />

      <ThemeSelect />
    </div>
  );
};

const ThemeSelect = () => {
  const { theme, updateTheme } = useTheme();

  return (
    <div>
      <h3>Current theme: {theme}</h3>

      <select
        value={theme}
        onChange={(event) => updateTheme(event.target.value as Theme)}
      >
        {Object.entries(Theme).map(([label, value]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
