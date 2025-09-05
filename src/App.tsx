import { Routes, Route } from 'react-router-dom'
import LearnStructure from './features/kiosk/learn-structure/LearnStructure'
import OrderStart from './features/kiosk/learn-order/OrderStart'
import LoginForm from './features/login/LoginForm'
import SignupForm from './features/login/SignupForm'
import Payment from './features/kiosk/learn-payment/Payment'
import MyPage from './features/mypage/MyPage'
import Home from './features/home/Home'

function App() {

  return (
    <Routes>
      <Route path="/teachmap/kioskstructure" element={<LearnStructure />} />
      <Route path="/teachmap/kioskorder" element={<OrderStart />} />
      <Route path="/teachmap/kioskpayment" element={<Payment />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
