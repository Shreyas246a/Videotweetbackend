import React, { useState } from 'react'
import { Loginpage } from './pages/login'
import Register from './pages/Register'
import { BrowserRouter,Routes ,Route } from 'react-router-dom'
import { AuthProvider } from './contexts/Authcontext'
import Dashboard from './pages/Dashboard'

function App() {



  return (
    <div>
<BrowserRouter>
<Routes>
<Route path="/login" element={<Loginpage />} />
<Route path='/dashboard' element={<Dashboard/>}/>
<Route path="/" element={<Register />} />
</Routes>
</BrowserRouter>
</div>
)
}

export default App
