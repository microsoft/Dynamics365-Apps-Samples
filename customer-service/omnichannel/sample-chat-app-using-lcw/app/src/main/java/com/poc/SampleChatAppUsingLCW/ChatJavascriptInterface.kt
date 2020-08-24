package com.poc.SampleChatAppUsingLCW

import android.content.Context
import android.webkit.JavascriptInterface

class  ChatJavascriptInterface{
    var mContext:Context

    constructor(c: Context)
    {
        this.mContext = c
    }

    @JavascriptInterface fun saveValue(stateData: String) : String
    {
        return stateData
    }
}