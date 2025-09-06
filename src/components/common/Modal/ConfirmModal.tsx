interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "확인",
  cancelText = "취소"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-[16px] px-5 py-7 w-[80%] max-w-[300px] text-center">
        <p className="text-lg font-semibold mb-6">{title}</p>
        <div className="flex justify-between gap-2">
          <button
            className="flex-1 bg-[#ececec] text-base text-black py-[10px] px-[20px] rounded-full"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="flex-1 bg-[#FFD845] text-base text-black py-[10px] px-[20px] rounded-full"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
