import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'

import "./App.scss"

import MemeListPage from './pages/MemeListPage'
import NotFoundPage from './pages/NotFoundPage'
import MemeAddPage from './pages/MemeAddPage'

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/add" />} />
        <Route path="/add" element={<Navigate to="/add/" />} />
        <Route path="/add/:addr" element={<MemeAddPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}