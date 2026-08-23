const BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7296/api';

interface ApiConfig {
  headers?: Record<string, string>;
}

// Định nghĩa kiểu dữ liệu trả về của API Refresh
interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

// Hàm xử lý Logout khi không thể refresh token
function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // Có thể dispatch event hoặc chuyển hướng trang tại đây nếu cần
  console.log('Đã đăng xuất do phiên hết hạn. Vui lòng đăng nhập lại.');
}

// Hàm request chung xử lý logic fetch, headers, parse JSON và Refresh Token
async function request<T>(endpoint: string, method: string, body?: any, config?: ApiConfig): Promise<T> {

  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  // 1. Thực hiện gọi API lần đầu
  let response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 2. Kiểm tra nếu bị lỗi 401 (Unauthorized)
  // ĐIỂM SỬA ĐỔI: Thêm điều kiện && endpoint !== '/Auth/login'
  // Lý do: Khi login sai pass, server trả 401, ta không nên gọi refresh token làm gì.
  if (response.status === 401 && endpoint !== '/Auth/refresh' && endpoint !== '/Auth/login') {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    const currentAccessToken = localStorage.getItem('accessToken');

    if (currentRefreshToken) {
      try {
        console.log('Token hết hạn. Đang thử lấy token mới...');

        // Gọi API Refresh Token
        // (Dùng fetch riêng để tránh gọi đệ quy hàm request này)
        const refreshRes = await fetch(`${BASE_URL}/Auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(currentAccessToken && {
              Authorization: `Bearer ${currentAccessToken}`, // Gửi access token cũ nếu backend yêu cầu
            }),
          },
          body: JSON.stringify({
            refreshToken: currentRefreshToken,
          }),
        });

        if (refreshRes.ok) {
          // Lấy token mới từ server
          const data: TokenResponse = await refreshRes.json();

          if (!data.access_token) {
            console.error("Lỗi: Server không trả về access_token", data);
            handleLogout();
            throw new Error('Refresh failed: No access token');
          }

          // Lưu lại vào LocalStorage
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('refreshToken', data.refresh_token);

          console.log('Refresh token thành công. Đang gọi lại API cũ...');

          // Cập nhật lại header Authorization với token mới
          headers = {
            ...headers,
            'Authorization': `Bearer ${data.access_token}`,
          };

          // 3. RETRY: Gọi lại request ban đầu với token mới
          response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
          });

        } else {
          // Refresh token cũng bị lỗi hoặc hết hạn -> Buộc đăng xuất
          console.error('Refresh token không hợp lệ.');
          handleLogout();
          // Ném lỗi để dừng flow hiện tại
          throw new Error('Session expired');
        }
      } catch (error) {
        // Lỗi kết nối hoặc xử lý -> Đăng xuất
        handleLogout();
        throw error;
      }
    } else {
      // Không có refresh token trong storage -> Đăng xuất
      handleLogout();
    }
  }

  // --- Xử lý các lỗi khác như cũ ---
  if (!response.ok) {
    const errorText = await response.text();
    // Trả về lỗi để UI (VD: trang Login) bắt được và hiển thị thông báo
    throw new Error(errorText || `HTTP Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

export const api = {
  get: <T>(endpoint: string, config?: ApiConfig) => request<T>(endpoint, 'GET', undefined, config),
  post: <T>(endpoint: string, body: any, config?: ApiConfig) => request<T>(endpoint, 'POST', body, config),
  put: <T>(endpoint: string, body: any, config?: ApiConfig) => request<T>(endpoint, 'PUT', body, config),
  delete: <T>(endpoint: string, config?: ApiConfig) => request<T>(endpoint, 'DELETE', undefined, config),
  patch: <T>(endpoint: string, body: any, config?: ApiConfig) => request<T>(endpoint, 'PATCH', body, config),
};
  