package com.poc.SampleChatAppUsingLCW

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import com.poc.SampleChatAppUsingLCW.ui.contactus.ContactusFragment

class ChatWebChromeClient : WebChromeClient
{

    var contactusFragment: ContactusFragment
    var mContext:Context
    private var uploadMessage: ValueCallback<Array<Uri>>? = null
    public val UploadMessage: ValueCallback<Array<Uri>>?
        get() {
            return uploadMessage
        }

    constructor( context:Context, contactusFragment: ContactusFragment)
    {
        this.mContext = context
        this.contactusFragment = contactusFragment
    }

    override fun onShowFileChooser(webView: WebView?, filePathCallback: ValueCallback<Array<Uri>>?, fileChooserParams: WebChromeClient.FileChooserParams): Boolean {
        uploadMessage?.onReceiveValue(null)
        uploadMessage = null

        uploadMessage = filePathCallback

        val intent = fileChooserParams.createIntent()
        try {
            this.contactusFragment.startActivityForResult(intent, REQUEST_SELECT_FILE)
        } catch (e: ActivityNotFoundException) {
            uploadMessage = null
            Toast.makeText(mContext, "Cannot Open File Chooser", Toast.LENGTH_LONG).show()
            return false
        }

        return true
    }
}