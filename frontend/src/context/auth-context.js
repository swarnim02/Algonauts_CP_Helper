import { createContext } from 'react';

/**
 * Lives in its own module so AuthContext.jsx exports only a component.
 * Mixing component and non-component exports in one file breaks React Fast
 * Refresh, which is what react-refresh/only-export-components warns about.
 */
export const AuthContext = createContext(null);
