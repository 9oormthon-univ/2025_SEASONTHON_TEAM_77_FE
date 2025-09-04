import { Routes, Route } from 'react-router-dom'
import LearnStructure from './features/kiosk/learn-structure/LearnStructure'
import OrderStart from './features/kiosk/learn-order/OrderStart'
import LoginForm from './features/login/LoginForm'
import SignupForm from './features/login/SignupForm'

function App() {

  return (
    <Routes>
      <Route path="/teachmap/kioskstructure" element={<LearnStructure />} />
      <Route path="/teachmap/kioskorder" element={<OrderStart />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  )
}

export default App
