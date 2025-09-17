import { useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { requestTTSAPI } from '../shared/api';
import { useTTS } from './useTTS';

export const useTTSPlayer = () => {
  const { isTTSEnabled } = useTTS();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTTS = useCallback(async (text: string): Promise<HTMLAudioElement | null> => {
    if (!isTTSEnabled || !text.trim()) return null;

    try {
      const response = await requestTTSAPI.requestTTS(text);

      // base64 → binary
      const base64String = response.replace(/\n/g, '').replace(/\r/g, '');
      const binary = atob(base64String);
      const byteArray = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        byteArray[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: 'audio/mpeg' }); // 실제 포맷 확인 필요
      const url = URL.createObjectURL(blob);

      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
      };

      await audio.play().catch(err => {
        console.error("브라우저에서 TTS 재생 거부:", err);
      });

      return audio;
    } catch (error) {
      toast.error('음성 재생에 실패했습니다.');
      return null;
    }
  }, [isTTSEnabled]);

  const stopTTS = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
      console.log("TTS 중단됨");
    }
  }, []);

  return { playTTS, stopTTS, isTTSEnabled };
};
