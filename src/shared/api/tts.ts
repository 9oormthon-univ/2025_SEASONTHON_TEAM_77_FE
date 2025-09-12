import axios from 'axios';

const API_BASE_URL = 'http://3.36.238.38:8080/api/v1.0';

export const requestTTSAPI = {
    requestTTS: async (text: string) =>{
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
            `${API_BASE_URL}/tts`,
            { text },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.audioContent;
    },
};