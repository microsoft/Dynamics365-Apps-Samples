package com.poc.SampleChatAppUsingLCW

class ClientConfigs {
    companion object {
        val config = mapOf(
            "chatUrl" to "file:///android_asset/inapp.html",
            "c2Src" to "",
            "orgUrl" to "",
            "orgId" to "",
            "widgetId" to "",
            "colorOverride" to "008577", // Leave blank for default and do not add # in color code
            "hideChatButton" to "true",
            "renderMobile" to "true"
        )
    }
}