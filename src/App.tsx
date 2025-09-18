import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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
import Analysis from './features/analysis/Analysis'
import ProtectedRoute from './ProjectedRoute'

function App() {
  return (
    <TTSProvider>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap" element={
          <ProtectedRoute>
            <TeachMap />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap/kioskstructure" element={
          <ProtectedRoute>
            <LearnStructure />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap/kioskorder" element={
          <ProtectedRoute>
            <OrderStart />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap/kioskmenu" element={
          <ProtectedRoute>
            <LearnMenu />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap/kioskmenuorder" element={
          <ProtectedRoute>
            <LearnOrder />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap/kioskordercheck" element={
          <ProtectedRoute>
            <OrderCheck />
          </ProtectedRoute>
        } />
        
        <Route path="/retouch" element={
          <ProtectedRoute>
            <Retouch />
          </ProtectedRoute>
        } />
        
        <Route path="/teachmap/kioskpayment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        
        <Route path="/order-analysis" element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Toast 알림 */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Pretendard',
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
        }}
      />
    </TTSProvider>
  )
}

export default App
