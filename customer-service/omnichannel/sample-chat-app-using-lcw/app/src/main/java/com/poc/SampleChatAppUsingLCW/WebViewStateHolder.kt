package com.poc.SampleChatAppUsingLCW

import android.os.Bundle
import android.webkit.WebView

enum class WebViewStateHolder {
    INSTANCE;

    var bundle: Bundle? = null
        private set

    fun saveWebViewState(webView: WebView?, chatState:ChatState) {
        bundle = Bundle()
        bundle!!.putString("chatState", chatState.toString())
        webView?.saveState(bundle)
    }
}