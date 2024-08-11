import "./MemeCard.scss"
import shortifyBalance from "../utils/shortifyBalance"

export function MemeList({
  children
}) {
  return <div className="meme-cards">{children}</div>
}

export function MemeCard({
  rightButton,
  title,
  stakedAmount,
  balanceAmount,
  totalPoints,
  color,
  color2,
  number,
  image,
  onClick,
  children,
}) {
  return (
    <div className="meme-card" onClick={onClick} style={{ maxWidth: (window.innerWidth - 35) + "px" }}>
      <div className="left">
        {
          number !== undefined
          &&
          <>
            <div className="number">
              #{number}
            </div>
            <div className="sep">
            </div>
          </>
        }

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
        {
          totalPoints !== undefined
          &&
          <div className="volume">
            <div className="title">
              POINTS
            </div>
            <div className="value">
              {shortifyBalance(totalPoints, 18)}
            </div>
          </div>
        }
        {
          stakedAmount !== undefined
          &&
          stakedAmount !== null
          &&
          <div className="volume">
            <div className="title">
              STAKED
            </div>
            <div className="value">
              {shortifyBalance(stakedAmount, 18)}
            </div>
          </div>
        }
        {
          balanceAmount !== undefined
          &&
          balanceAmount !== null
          &&
          <div className="volume">
            <div className="title">
              BALANCE
            </div>
            <div className="value">
              {shortifyBalance(balanceAmount, 18)}
            </div>
          </div>
        }
      </div>
      <div className="right">
        <div>
          {rightButton}
        </div>
      </div>
    </div>
  )
}
