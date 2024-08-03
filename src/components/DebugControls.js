import Button from "./Button"

export default function ({
  enable,
}) {
  return (
    <>
      {
        enable
        &&
        <div>
          <Button onClick={() => {
            window.localStorage.clear()
            window.location.reload()
          }}>
            CLEAR LOCAL STORAGE AND RELOAD
          </Button>
          <Button onClick={() => {
            window.localStorage.clear()
            window.localStorage.setItem("id", "1")
            window.location.reload()
          }}>
            Set id 1
          </Button>
          <Button onClick={() => {
            const id = parseInt(window.localStorage.getItem("id"))
            window.localStorage.clear()
            window.localStorage.setItem("id", id+1)
            window.location.reload()
          }}>
            Set ++id
          </Button>
        </div>
      }
    </>

  )
}