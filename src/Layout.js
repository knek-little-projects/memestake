import BottomNav from "./components/BottomNav"

export default function({ children}) {
  return (
    <div>
      <div>
        {children}
      </div>
      <div>
        <BottomNav />
      </div>
    </div>
  )
}