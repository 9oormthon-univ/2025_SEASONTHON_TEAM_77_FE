import { useContext } from 'react';
import { TTSContext } from '../contexts/ttsContext';

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};
