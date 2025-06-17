import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import swal from "sweetalert";

// Kullanıcı bilgileri için TypeScript arayüzü
export interface UserState {
  tcIdNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage: string | null;
  loading: boolean;
  token: string | null;
}

// Başlangıç durumu
const initialState: UserState = {
  tcIdNumber: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  errorMessage: null,
  loading: false,
  token: localStorage.getItem("token") || null, // Token'ı LocalStorage'dan al
};

// API isteklerini yapan yardımcı fonksiyon
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token"); // Token'ı al

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Token varsa Authorization ekle
  };

  return fetch(url, { ...options, headers });
};

// Kullanıcı kayıt işlemi
export const registerUser = createAsyncThunk(
  "user/register",
  async (userRegister: Partial<UserState>, { rejectWithValue }) => {
    try {
      const response = await fetchWithToken("http://localhost:9090/v1/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userRegister),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData); // Hata mesajını Redux store’a aktar
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Token'ı kaydet

      return data;
    } catch (error) {
      return rejectWithValue("Something went wrong. Please try again later.");
    }
  }
);

// Kullanıcı giriş işlemi
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ tcIdNumber, password }: { tcIdNumber: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetchWithToken("http://localhost:9090/v1/api/auth/dologin", {
        method: "POST",
        body: JSON.stringify({ tcIdNumber, password }),
      });

      const data = await response.json();
      if (!data.token) {
        return rejectWithValue("Invalid response from server");
      }

      localStorage.setItem("token", data.token); // Token'ı kaydet
      return data.token; // Başarılı ise token'ı döner
    } catch (error) {
      return rejectWithValue("Something went wrong! Please try again later.");
    }
  }
);

// Kullanıcı çıkış işlemi
export const logoutUser = () => {
  localStorage.removeItem("token"); // Token'ı temizle
  window.location.href = "/login"; // Giriş ekranına yönlendir
};

// Kullanıcı slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    resetUser(state) {
      logoutUser(); // Çıkış işlemini çağır
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Register işlemi
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token; // Redux state'e token kaydet
        swal("Success", "Registration successful", "success").then(() => {
          window.location.href = "/login"; // Yönlendirme
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload as string;
        swal("Error", state.errorMessage, "error");
      });

    // Login işlemi
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Redux state'e token kaydet
        swal("Success", "Login successful", "success").then(() => {
          window.location.href = "/profile"; // Yönlendirme
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