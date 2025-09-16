import axios from 'axios';

const API_BASE_URL = 'http://3.36.238.38:8080/api/v1.0';

export const homeAPI = {
  // 주간 출석 상태 조회 API
  getWeeklyStatus: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(
      `${API_BASE_URL}/attendance/weekly-status`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // 출석 체크 API
  checkAttendance: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${API_BASE_URL}/attendance/check-in`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};
