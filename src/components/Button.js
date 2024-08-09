import "./Button.scss"

export default function ({ children, ...props }) {
  return (
    <div className="my-button-wrapper">
      <button {...props}>{children}</button>
    </div>
  )
}