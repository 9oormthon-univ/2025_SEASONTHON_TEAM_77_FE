import { Routes, Route } from 'react-router-dom'
import LearnStructure from './features/kiosk/learn-structure/LearnStructure'
import OrderStart from './features/kiosk/learn-order/OrderStart'
import LearnMenu from './features/kiosk/learn-menu/CategoryExplain'
import LearnOrder from './features/kiosk/learn-menu/MenuOrder'
import OrderCheck from './features/kiosk/learn-menu/OrderCheck'
import Retouch from './features/retouch/Retouch'
import LoginForm from './features/login/LoginForm'
import SignupForm from './features/login/SignupForm'
import Payment from './features/kiosk/learn-payment/Payment'
import MyPage from './features/mypage/MyPage'
import Home from './features/home/Home'
import TeachMap from './features/kiosk/TeachMap'
import { TTSProvider } from './contexts/TTSProvider'

function App() {
  return (
    <TTSProvider>
      <Routes>
        <Route path="/teachmap/kioskstructure" element={<LearnStructure />} />
        <Route path="/teachmap/kioskorder" element={<OrderStart />} />
        <Route path="/teachmap/kioskmenu" element={<LearnMenu />} />
        <Route path="/teachmap/kioskmenuorder" element={<LearnOrder />} />
        <Route path="/teachmap/kioskordercheck" element={<OrderCheck />} />
        <Route path="/teachmap/retouch" element={<Retouch />} />
        <Route path="/teachmap/kioskpayment" element={<Payment />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/teachmap" element={<TeachMap />} />
      </Routes>
    </TTSProvider>
  )
}

export default App
