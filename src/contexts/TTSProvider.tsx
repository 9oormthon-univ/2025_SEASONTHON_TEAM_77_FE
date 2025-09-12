import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { TTSContext } from './ttsContext';

interface TTSProviderProps {
  children: ReactNode;
}

export const TTSProvider: React.FC<TTSProviderProps> = ({ children }) => {
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);

  return (
    <TTSContext.Provider value={{ isTTSEnabled, setIsTTSEnabled }}>
      {children}
    </TTSContext.Provider>
  );
};
