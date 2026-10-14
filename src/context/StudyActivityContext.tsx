import { createContext } from 'react';
// Retained review activities stay mounted; their page-wide effects should
// follow visibility so returning to a draft restores its own subject colors.
export const StudyActivityVisibleContext = createContext(true);
