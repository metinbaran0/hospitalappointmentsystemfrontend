import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import swal from "sweetalert";
import { IUserProfile } from "../../model/IUserProfile";

// Kullanıcı bilgileri için TypeScript arayüzü
export interface UserState {
  tcIdNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | null; // dateOfBirth'i null'a izin verecek şekilde değiştirdim
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage: string | null;
  loading: boolean;
  token: string | null;
  user: IUserProfile | null; // Kullanıcı profil bilgilerini saklamak için
}

// Başlangıç durumu
const initialState: UserState = {
  tcIdNumber: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: null,
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  errorMessage: null,
  loading: false,
  token: localStorage.getItem("authToken") || null,
  user: null,
};

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Token alma fonksiyonu (Gerekli değil, fetchWithToken içinde yapılıyor)
// const getToken = (): string | null => {
//  return localStorage.getItem("authToken");
// };

// Auth header fonksiyonu (fetchWithToken içinde birleştirildi)
// const getAuthHeader = () => {
//  const token = getToken();
//  return {
//  headers: {
//  Authorization: token ? `Bearer ${token}` : "",
//  "Content-Type": "application/json",
//  },
//  };
// };

// Backend'e fetch atma fonksiyonu
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken"); // Token'ı burada alıyoruz
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Token varsa ekliyoruz
  };
  return fetch(url, { ...options, headers });
};

// Kullanıcı kayıt işlemi - Düzenlenmiş versiyon
export const registerUser = createAsyncThunk(
  "user/register",
  async (userRegister: Partial<UserState>, { rejectWithValue }) => {
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          ...userRegister,
          // Eksik alanların dönüşümü
          dateOfBirth: userRegister.dateOfBirth ? new Date(userRegister.dateOfBirth).toISOString() : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Backend'den gelen hata formatına uygun hale getirme
        return rejectWithValue(errorData.message || errorData.error || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong. Please try again later.");
    }
  }
);

// Login işlemi - Düzenlenmiş versiyon
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { loginIdentifier, password }: { loginIdentifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchWithToken(`${API_BASE_URL}/auth/dologin`, {
        method: "POST",
        body: JSON.stringify({
          loginIdentifier,
          password,
          deviceId: "web-" + navigator.userAgent,
          captchaToken: "bypass-for-dev",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend hata yapısına göre düzenleme
        const errorMessage = data.message ||
          (data.error && typeof data.error === 'string' ? data.error : "Login failed");
        return rejectWithValue(errorMessage);
      }

      if (!data.token) {
        return rejectWithValue("Invalid response from server");
      }

      localStorage.setItem("authToken", data.token);

      // Kullanıcı profil bilgilerini çek
      const profileResponse = await fetchWithToken(`${API_BASE_URL}/auth/get-profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (!profileResponse.ok) {
        return rejectWithValue("Could not fetch user profile");
      }

      const profileData = await profileResponse.json();
      return { ...data, user: profileData.data };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong! Please try again later.");
    }
  }
);

// Kullanıcı çıkış işlemi
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/login";
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    resetUser() {
      logoutUser();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        swal("Success", "Registration successful", "success").then(() => {
          window.location.href = "/login";
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
        swal("Error", state.errorMessage, "error");
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user; // Kullanıcı bilgilerini state'e kaydediyoruz
        swal("Success", "Login successful", "success").then(() => {
          window.location.href = "/profile";
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
        swal("Error", state.errorMessage, "error");
      });
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
