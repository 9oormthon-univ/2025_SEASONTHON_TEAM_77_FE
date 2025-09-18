import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import HeaderBar from '../../components/HeaderBar';
import IntroScreen from '../../components/teachmap/IntroScreen';
import { ocrAPI } from '../../shared/api';
import ActionButton from '../../components/buttons/ActionButton';
import { useTTS } from '../../hooks/useTTS';
import { useTTSPlayer } from '../../hooks/useTTSPlayer';
import { AnalysisTooltip } from '../../components/tooltip/AnalysisTooltip';

const Analysis = () => {
    const [page, setPage] = useState<'intro' | 'ocr'>('intro');
    const [step, setStep] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [ocrResult, setOcrResult] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const { setIsTTSEnabled } = useTTS();
    const [showTooltip, setShowTooltip] = useState(false);
    const [isTTSActive, setIsTTSActive] = useState(false);
    const { playTTS, stopTTS } = useTTSPlayer();

    useEffect(() => {
        if (step === 2) {
        setShowTooltip(true); // 결과 화면 진입 시 표시
        const timer = setTimeout(() => {
            setShowTooltip(false); // 3초 뒤 사라짐
        }, 8000);
        return () => clearTimeout(timer);
        }
    }, [step]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAnalysis = async () => {
        if (!file) return;
        setStep(1);
        setLoading(true);
        try {
            const res = await ocrAPI.ocrGenerateFromImage(file);
            setOcrResult(res.content);
            setStep(2);
        } catch (err) {
            toast.error("이미지 분석에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep(0);
        setPreview(null);
        setFile(null);
        setOcrResult("");
    };

    const handleTTSClick = async () => {
    if (!ocrResult.trim()) return;

    if (isTTSActive) {
        stopTTS();
        setIsTTSEnabled(false);
        setIsTTSActive(false);
    } else {
        setIsTTSEnabled(true);
        const audio = await playTTS(ocrResult);
        if (audio) {
        audio.onended = () => setIsTTSActive(false);
        setIsTTSActive(true);
        }
    }
    };

    return (
        <div className="relative w-full h-screen">
            <HeaderBar title="실시간 안내" backTo="/" />
            
            <AnimatePresence>
                {page === 'intro' && (
                    <IntroScreen
                        title="키오스크 화면을 촬영하면<br />주문 방법을 바로 안내해 드려요"
                        onStart={() => {
                            setPage('ocr');
                            setStep(0);
                        }}
                    />
                )}
            </AnimatePresence>

            {page === 'ocr' && (
                <div className="absolute inset-0 w-full h-[797px] bg-white">
                    <div className="relative flex flex-col items-center justify-center">
                        <>
                        {step === 0 && (
                            <>
                            <div className="w-full p-7 flex flex-col items-start justify-center mt-[63px]">
                                <h1 className="text-[26px] text-black mb-2 font-bold leading-[140%]">
                                    AI 키오스크 주문 안내
                                </h1>
                                <p className="text-base text-[#575757] font-normal leading-[160%]">
                                    키오스크 화면을 촬영해 올리면, <br />
                                    AI가 분석해 주문 방법을 바로 안내해 드려요.
                                </p>
                            </div>
                            
                            {/* 업로드 박스 */}
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    onClick={handleClick}
                                    className="flex flex-col items-center justify-center w-[327px] h-[327px] border-2 border-dashed border-[#C1C1C1] rounded-[16px] bg-[#F6F5F4] cursor-pointer"
                                >
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="w-full h-full object-cover rounded-[16px]"
                                        />
                                    ) : (
                                        <>
                                            <img src="/assets/analysis/upload.svg" alt="upload" className="w-[32px] h-[32px] mb-3" />
                                            <p className="text-base text-black font-semibold leading-[160%]">사진 올리기</p>
                                        </>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <ActionButton
                                onClick={handleAnalysis}
                                variant="primary"
                                size="md"
                                className="fixed bottom-[60px] w-[327px]"
                            >
                                분석하기
                            </ActionButton>
                        </>
                    )}
                    {step === 1 && (
                    <div className="flex flex-col items-center justify-center w-full h-screen">
                        {loading && (
                        <>
                            <img
                            src="/assets/analysis/loading.gif"
                            alt="loading"
                            className="w-[128px] h-[32px] mb-[100px]"
                            />
                            <p className="text-lg text-black font-semibold leading-[140%] mb-7">
                            주문 방법을 열심히 분석 중이에요!
                            </p>
                            <p className="text-base text-[#575757] font-normal leading-[160%]">
                            잠시만 기다려 주세요.
                            </p>
                        </>
                        )}
                    </div>
                    )}

                    {step === 2 && (
                    <div className="w-full px-7 py-2 flex flex-col items-start justify-center mt-[63px] relative">
                        <div className="w-full flex flex-col items-center gap-4">
                        {preview && (
                            <img
                            src={preview}
                            alt="uploaded"
                            className="w-[327px] h-[327px] object-cover rounded-[16px]"
                            />
                        )}
                        {ocrResult && (
                            <div className="w-[327px] p-[20px] h-[283px] rounded-[16px] bg-[#F6F5F4]">
                            <img src="/assets/analysis/ai.svg" alt="ai" className="w-[70px] h-[27px] mb-2" />
                            <p className="max-h-[200px] overflow-y-auto text-base text-black font-normal leading-[160%] whitespace-pre-line">
                                {ocrResult}
                            </p>
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-2">
                            <ActionButton
                            onClick={handleReset}
                            variant="primary"
                            size="md"
                            className="w-[327px] mt-[10px]"
                            >
                            분석 이어하기
                            </ActionButton>
                        </div>
                        </div>

                        {/* TTS 버튼 + Tooltip */}
                        {ocrResult && (
                          <div className="fixed bottom-[70px] right-[16px] flex items-center justify-center">
                            {/* Tooltip (왼쪽) */}
                            <AnalysisTooltip showTooltip={showTooltip} />

                            {/* TTS 버튼 */}
                            <button
                            onClick={handleTTSClick}
                            className="w-[57px] h-[57px] flex items-center justify-center"
                            aria-label="TTS 듣기"
                            >
                            <img
                                src={isTTSActive ? "/assets/analysis/tts_icon_after.png" : "/assets/analysis/tts_icon.png"}
                                alt="tts"
                                className="w-[57px] h-[57px]"
                            />
                            </button>
                          </div>
                        )}
                    </div>
                    )}
                        </>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analysis;
