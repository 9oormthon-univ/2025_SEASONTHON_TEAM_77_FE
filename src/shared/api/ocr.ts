import axios from 'axios';

const API_BASE_URL = 'http://3.36.238.38:8080/api/v1.0';

export const ocrAPI = {
  // 학습 완료 API
  ocrGenerateFromImage: async (file: File) => {
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_BASE_URL}/ocr/generate-from-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};