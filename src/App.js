import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'

import "./App.scss"

import MemeListPage from './pages/MemeListPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/memes" />} />
        <Route path="/memes" element={<MemeListPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}