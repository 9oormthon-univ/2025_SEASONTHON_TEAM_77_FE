import { Routes, Route } from 'react-router-dom'
import LearnStructure from './features/kiosk/learn-structure/LearnStructure'
import OrderStart from './features/kiosk/learn-order/OrderStart'
import LearnMenu from './features/kiosk/learn-menu/CategoryExplain'
import LearnOrder from './features/kiosk/learn-menu/MenuOrder'

function App() {
  return (
    <Routes>
      <Route path="/teachmap/kioskstructure" element={<LearnStructure />} />
      <Route path="/teachmap/kioskorder" element={<OrderStart />} />
      <Route path="/teachmap/kioskmenu" element={<LearnMenu />} />
      <Route path="/teachmap/kioskmenuorder" element={<LearnOrder />} />
    </Routes>
  )
}

export default App
