import "./MemeCard.scss"

export default function ({
  title,
  color,
  color2,
  image,
  onClick,
  children,
}) {
  color2 = "transparent"

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
      <div>
        PUMP
      </div>
    </div>
  )
}
