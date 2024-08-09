import BottomNav from "./components/BottomNav"

export default function ({ children }) {
  return (
    <div>
      <div>
        {children}
      </div>
      <div style={{paddingBottom: "60px"}}>
      </div>
      <div>
        <BottomNav height={60}/>
      </div>
    </div>
  )
}