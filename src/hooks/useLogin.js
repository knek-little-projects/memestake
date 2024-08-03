import useAsyncRequest from './useAsyncRequest'
import { login } from "../api"

export default function useLogin() {
  const userLoader = useAsyncRequest(login, [])
  return {
    isLoggedIn: !!userLoader.data,
    ...userLoader
  }
}
