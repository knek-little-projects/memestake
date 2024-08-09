import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'

import "./App.scss"

import MemeListPage from './pages/MemeListPage'
import NotFoundPage from './pages/NotFoundPage'
import MemeAddPage from './pages/MemeAddPage'
import Layout from './Layout'

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/memes/" />} />
          <Route path="/memes" element={<Navigate to="/memes/" />} />
          <Route path="/memes/" element={<MemeListPage />} />
          <Route path="/memes/add" element={<Navigate to="/add/" />} />
          <Route path="/memes/add/" element={<MemeAddPage />} />
          <Route path="/memes/add/:addr" element={<MemeAddPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}