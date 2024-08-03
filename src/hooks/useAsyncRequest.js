import { useRef, useState, useEffect, useCallback } from 'react'

export default function useAsyncRequest(asyncFunction, dependencies = []) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    if (!asyncFunction) {
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFunction()
      setData(result)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { loading, data, error, refetch: execute }
}
