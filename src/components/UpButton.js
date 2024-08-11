import "./UpButton.scss"
import Button from "./Button"
import url from "../url"

export default function ({
  onClick,
  children,
}) {
  // #3ac516
  return (
    <button className="up-button" onClick={onClick}>
      <img src={url("ui/up.png")} />
      {children}
    </button>
  )
}