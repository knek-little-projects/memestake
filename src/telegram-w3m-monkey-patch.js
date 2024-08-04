import { W3mConnectingWcMobile } from "@web3modal/scaffold-ui"
import { ConnectionController, CoreHelperUtil, EventsController } from '@web3modal/core';

// import "scaffold-ui/dist/esm/src/partials/w3m-connecting-wc-mobile/index.js"

W3mConnectingWcMobile.prototype.onConnectProxy = function () {
  if (this.wallet?.mobile_link && this.uri) {
    try {
      this.error = false;
      const { mobile_link, name } = this.wallet;
      const { redirect, href } = CoreHelperUtil.formatNativeUrl(mobile_link, this.uri);
      ConnectionController.setWcLinking({ name, href });
      ConnectionController.setRecentWallet(this.wallet);
      // CoreHelperUtil.openHref(redirect, '_self');
      console.debug("wallet href", { redirect, name, href })
      if (window.Telegram?.WebApp?.openLink) {
        // window.Telegram.WebApp.openLink(redirect, {try_instant_view: false})
        const wredirect = window.location.origin + "/?wredirect=" + encodeURIComponent(redirect)
        window.Telegram.WebApp.openLink(wredirect, {try_instant_view: false})
      } else {
        const a = document.createElement("a")
        a.href = redirect
        a.target = "_blank"
        document.body.appendChild(a);
        a.click()
      }
    }
    catch {
      this.error = true;
    }
  }
}