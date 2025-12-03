import { useState } from 'react'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import Add from './Pages/Add'
import Lists from './Pages/Lists'
import Login from './Pages/Login'
import Orders from './Pages/Orders'
import Home from './Pages/Home'
import { useContext   } from 'react'
import { adminDataContext } from './Context/AdminContext'
import Settings from './Pages/Settings'


function App() {

let {adminData} = useContext(adminDataContext)
  return (
    <>
    {
      !adminData ? <Login /> : <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Home/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>

      </>
      }
    </>
  )
}

export default App
