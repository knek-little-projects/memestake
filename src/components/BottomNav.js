import "./BottomNav.scss"
import url from "../url"
import { useLocation, useNavigate } from "react-router-dom"

function BottomNavButton({ image, text, path }) {
  const nav = useNavigate()
  const location = useLocation()
  const isActive = location.pathname.startsWith(path)

  const onClick = isActive ? undefined : () => nav(path);

  return (
    <div className={`button ${isActive && "is-active"}`} onClick={onClick} >
      <div className="image">
        <img src={url(image)} />
      </div>
      <div className="text">
        {text}
      </div>
    </div>
  )
}

export default function ({
  height
}) {
  
  const style = {
    height: height + 'px',
    maxHeight: height + 'px',
  }
  
  return (
    <div>
      <div className="bottom-nav" style={style}>
        <BottomNavButton image="ui/rocket.png" text="MEMES" path="/memes" />
        <BottomNavButton image="ui/handshake.png" text="FRIENDS" path="/friends" />
        <BottomNavButton image="ui/stoneface.png" text="STAKE" path="/profile" />
        <BottomNavButton image="ui/exlmark.png" text="MISSIONS" path="/missions" />
        <BottomNavButton image="ui/leaderboard.png" text="AIRDROP" path="/airdrop" />
      </div>
    </div>
  )
}