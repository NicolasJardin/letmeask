import { Home } from './pages/home/Home'
import { NewRoom } from './pages/newRoom/NewRoom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { AuthContextProvider } from './contexts/AuthContext'
import { Room } from './pages/room/Room'
import { AdminRoom } from './pages/adminRoom/AdminRoom'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/rooms/new' component={NewRoom} />
          <Route path='/rooms/:id' component={Room} />
          <Route path='/admin/rooms/:id' component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
