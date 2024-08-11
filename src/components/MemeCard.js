import "./MemeCard.scss"
import UpButton from "./UpButton"
import Button from "./Button"

export function MemeList({
  children
}) {
  return <div className="meme-cards">{children}</div>
}

export function MemeCard({
  rightButton,
  title,
  totalPoints,
  color,
  color2,
  number,
  image,
  onClick,
  children,
}) {
  return (
    <div className="meme-card" onClick={onClick}>
      <div className="left">
        <div className="number">
          #{number}
        </div>
        <div className="sep">
        </div>

        <div className="meme-card-ava">
          <div className="top" style={{ backgroundColor: color }}>
            <div className="meme-img-container">
              <img src={image} />
            </div>
          </div>
          <div className="bottom" style={{ backgroundColor: color2 }}>
            <h2>{title}</h2>
            {children}
          </div>
        </div>
      </div>
      <div className="center">

        <div className="volume">
          <div className="title">
            POINTS
          </div>
          <div className="value">
            {totalPoints}
          </div>
        </div>
      </div>
      <div className="right">
        <div>
          {rightButton}
        </div>
      </div>
    </div>
  )
}
