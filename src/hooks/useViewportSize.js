import { useState, useEffect } from 'react'

const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState({
    width: window.visualViewport.width,
    height: window.visualViewport.height,
  })

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({
        width: window.visualViewport.width,
        height: window.visualViewport.height,
      })
    }

    window.visualViewport.addEventListener('resize', updateViewport)

    // Cleanup function to remove the event listener
    return () => {
      window.visualViewport.removeEventListener('resize', updateViewport)
    }
  }, [])

  return viewportSize
}

export default useViewportSize
