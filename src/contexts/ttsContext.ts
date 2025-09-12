import { createContext } from 'react';

export interface TTSContextType {
  isTTSEnabled: boolean;
  setIsTTSEnabled: (enabled: boolean) => void;
}

export const TTSContext = createContext<TTSContextType | undefined>(undefined);
