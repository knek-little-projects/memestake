export default function openLink(url) {
  if (window.Telegram?.WebApp?.openLink) {
    window.Telegram.WebApp.openLink(url, { try_instant_view: false })
  } else {
    const a = document.createElement("a")
    a.href = url
    a.target = "_blank"
    document.body.appendChild(a);
    a.click()
  }
}
