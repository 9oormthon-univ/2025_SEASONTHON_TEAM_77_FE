import { Routes, Route } from 'react-router-dom'
import LearnStructure from './features/kiosk/learn-structure/LearnStructure'
import OrderStart from './features/kiosk/learn-order/OrderStart'

function App() {

  return (
    <Routes>
      <Route path="/teachmap/kioskstructure" element={<LearnStructure />} />
      <Route path="/teachmap/kioskorder" element={<OrderStart />} />
    </Routes>
  )
}

export default App
