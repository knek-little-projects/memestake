import "./MemeCard.scss"
import UpButton from "./UpButton"
import shortifyNumber from "../utils/shortifyNumber"

export default function ({
  title,
  volume,
  color,
  color2,
  image,
  onClick,
  onUpClick,
  children,
}) {
  return (
    <div className="meme-card" onClick={onClick}>
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
      <div className="volume">
        <div className="title">
          VOLUME
        </div>
        <div className="value">
          {shortifyNumber(volume)} $
        </div>
      </div>
      <div>
        <UpButton onClick={onUpClick} />
      </div>
    </div>
  )
}
