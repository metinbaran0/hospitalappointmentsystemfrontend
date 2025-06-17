// App.tsx
import { Routes, Route } from 'react-router-dom' // Sadece bu satır kalsın
// import { Routes, Route, Navigate } from "react-router-dom"; // BU SATIRI SİLİN
import Home from './page/Home'
import HospitalPanel from './page/HospitalPanel'
import LoginForm from './components/organisms/LoginForm'
import RegisterForm from './components/organisms/RegisterForm'
import Profile from './page/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hospital-panel" element={<HospitalPanel />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App