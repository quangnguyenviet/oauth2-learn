import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
