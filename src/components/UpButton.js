import "./UpButton.scss"
import Button from "./Button"
import url from "../url"

export default function ({
}) {
  return (
    <button>
      <img src={url("ui/up.png")} style={{ width: "60px" }} />
    </button>
  )
}