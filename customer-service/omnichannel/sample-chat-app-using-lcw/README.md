# Embed chat widget on a sample Android app

This sample code is intended for the reference of developers who are trying to create their own Android app with an embedded chat widget.

## Prerequisites

You will require the following before you get started with using this sample code.

- [Android Studio](https://developer.android.com/studio)
- Android 10.0 (API level 29)

## Getting Started

1. Configure a chat widget

Follow the instructions mentioned in the topic [Add a chat widget](https://docs.microsoft.com/en-us/dynamics365/omnichannel/administrator/add-chat-widget) to configure a chat widget.

2. Copy the widget snippet code from the **Code snippet** section and save it. It will be needed in the later steps.

It should look similar to this.

```html
    <script 
        id="Microsoft_Omnichannel_LCWidget"
        src="[your-src]"
        data-app-id="[your-app-id]"
        data-org-id="[your-org-id]" 
        data-org-url="[your-org-url]"
    >
    </script>
```

3. Add your chat widget config to [ClientConfigs.kt](app/src/main/java/com/poc/SampleChatAppUsingLCW/ClientConfigs.kt).

```kotlin
    val config = mapOf(
        "chatUrl" to "file:///android_asset/inapp.html",
        "c2Src" to "[your-src]",
        "orgUrl" to "[your-org-url]",
        "orgId" to "[your-org-id]",
        "widgetId" to "[your-app-id]",
        "colorOverride" to "008577", // Leave blank for default and do not add # in color code
        "hideChatButton" to "true",
        "renderMobile" to "true"
    )
```
