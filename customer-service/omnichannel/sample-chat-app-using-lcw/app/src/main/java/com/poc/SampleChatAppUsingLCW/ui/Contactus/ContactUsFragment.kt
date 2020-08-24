package com.poc.SampleChatAppUsingLCW.ui.contactus

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.*
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.poc.SampleChatAppUsingLCW.*
import android.widget.ProgressBar
import com.poc.SampleChatAppUsingLCW.ClientConfigs
import java.net.URL

class ContactusFragment : Fragment() {
    lateinit var chatWebView: WebView
    lateinit var menuItem: MenuItem
    lateinit var progressBar: ProgressBar
    var chatState: ChatState = ChatState.NEW
    private var mUploadMessage: ValueCallback<Uri>? = null
    private var chatWebChromeClient: ChatWebChromeClient? = null
    private var chatWebViewClient: ChatWebViewClient? = null

    override fun onPause() {
        WebViewStateHolder.INSTANCE.saveWebViewState(chatWebView, chatState)
        super.onPause()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        setHasOptionsMenu(true)
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_contactus, container, false)

        WebView.setWebContentsDebuggingEnabled(true)
        chatWebView = root.findViewById(com.poc.SampleChatAppUsingLCW.R.id.lcwWebView)
        chatWebView?.clearCache(true);
        chatWebView?.settings?.javaScriptEnabled = true
        chatWebView?.settings?.mediaPlaybackRequiresUserGesture = false
        chatWebView?.getSettings()?.setDomStorageEnabled(true);
        chatWebView?.getSettings()?.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        //liveChatWebView?.addJavascriptInterface(ChatJavascriptInterface(activity!!.applicationContext), "Chat")

        chatWebChromeClient = ChatWebChromeClient(activity!!.applicationContext, this@ContactusFragment)
        chatWebView?.webChromeClient = chatWebChromeClient

        chatWebView?.addJavascriptInterface(object : Any() {
            @JavascriptInterface fun changeChatStateToComplete() {
                chatState = ChatState.COMPLETE
            }

            @JavascriptInterface fun toggleChatIcon() {
                activity!!.invalidateOptionsMenu()
            }
        }, "Chat")

        chatWebViewClient = ChatWebViewClient(this@ContactusFragment)
        chatWebView?.webViewClient = chatWebViewClient


        if(WebViewStateHolder.INSTANCE.bundle == null) {
            var html: String = """
                <html>
                    <head>
                        <meta http-equiv="no-cache">
                        <meta http-equiv="Expires" content="-1">
                        <meta http-equiv="Cache-Control" content="no-cache">
                        <script 
                            type="text/javascript"
                            src="${ClientConfigs.config["c2Src"]}"
                            id="Microsoft_Omnichannel_LCWidget"
                            data-app-id="${ClientConfigs.config["widgetId"]}"
                            data-org-id="${ClientConfigs.config["orgId"]}"
                            data-org-url="${ClientConfigs.config["orgUrl"]}"
                            data-render-mobile="${ClientConfigs.config["renderMobile"]}"
                            data-hide-chat-button="${ClientConfigs.config["hideChatButton"]}"
                            ${if (ClientConfigs.config["colorOverride"] == "") "" else "data-color-override=#${ClientConfigs.config["colorOverride"]}"}
                        >
                        </script>
                    </head>
                    <body>
                    </body>
                </html>
            """.trimIndent()
            var url = URL(ClientConfigs.config["c2Src"])
            val baseUrl = "${url.protocol}://${url.host}"
            chatWebView?.loadDataWithBaseURL(baseUrl, html, "text/html", null, baseUrl)
        }
        else
            chatWebView?.restoreState(WebViewStateHolder.INSTANCE.bundle)

        return root
    }

    // add new chat button on menu bar
    override fun onCreateOptionsMenu(menu: Menu?, inflater: MenuInflater?) {
        var chatIconVisible = false
        if(chatState == ChatState.COMPLETE){
            chatIconVisible = true
        }
        menuItem = menu!!.add("Chat")
        menuItem?.setIcon(R.drawable.ic_chat);
        menuItem?.setVisible(chatIconVisible)
        menuItem?.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS)

    }

    override fun onOptionsItemSelected(item: MenuItem?): Boolean {
        when(item?.itemId) {
            menuItem?.itemId ->
            {
                if(chatState == ChatState.COMPLETE) {

                    chatState = ChatState.INPROGESS
                    chatWebView?.evaluateJavascript(
                        "Microsoft.Omnichannel.LiveChatWidget.SDK.startChat();Chat.toggleChatIcon();localStorage.setItem('IsChatClosed', 'false');",
                        null
                    )
                }
                return true
            }
            else -> {
                return super.onOptionsItemSelected(item)
            }
        }
    }

    // enable file upload
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        var uploadMessage = chatWebChromeClient?.UploadMessage
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            if (requestCode === REQUEST_SELECT_FILE) {

                if (uploadMessage == null)
                    return
                print("result code = " + resultCode)
                var results: Array<Uri>? = WebChromeClient.FileChooserParams.parseResult(resultCode, data)
                uploadMessage?.onReceiveValue(results)
                uploadMessage = null
            }
        } else if (requestCode === FILECHOOSER_RESULTCODE) {
            if (null == mUploadMessage)
                return
            val result = if (activity!!.intent == null || resultCode !== AppCompatActivity.RESULT_OK) null else activity!!.intent.data
            mUploadMessage?.onReceiveValue(result)
            mUploadMessage = null
        } else
            Toast.makeText(activity!!.applicationContext, "Failed to Upload Image", Toast.LENGTH_LONG).show()
    }
}