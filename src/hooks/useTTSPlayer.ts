import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { requestTTSAPI } from '../shared/api';
import { useTTS } from './useTTS';

export const useTTSPlayer = () => {
  const { isTTSEnabled } = useTTS();

  const playTTS = useCallback(async (text: string) => {
    if (!isTTSEnabled || !text.trim()) return;

    try {
      const response = await requestTTSAPI.requestTTS(text);
      
      // 1. base64 디코딩 → 바이너리
      const base64String = response.replace(/\n/g, '').replace(/\r/g, '');
      const binary = atob(base64String);
      const byteArray = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        byteArray[i] = binary.charCodeAt(i);
      }

      // 2. Blob 객체 생성 (MP3 타입 명시)
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });

      // 3. Object URL 생성 → Audio
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      // 메모리 누수 방지를 위해 재생 완료 후 URL 해제
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
      
      audio.play();
    } catch (error) {
      toast.error('음성 재생에 실패했습니다.');
    }
  }, [isTTSEnabled]);

  return { playTTS, isTTSEnabled };
};
