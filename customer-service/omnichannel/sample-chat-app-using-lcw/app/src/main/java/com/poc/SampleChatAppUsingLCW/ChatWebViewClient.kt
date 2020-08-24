package com.poc.SampleChatAppUsingLCW

import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import com.poc.SampleChatAppUsingLCW.ui.contactus.ContactusFragment


class ChatWebViewClient : WebViewClient {

    lateinit var contactusFragment: ContactusFragment

    constructor(contactusFragment: ContactusFragment ){
        this.contactusFragment = contactusFragment
    }

    override fun onPageFinished(view: WebView, url: String) {

        view.evaluateJavascript(scriptToRunPostChatClosureSteps(),null)

        // "if" block will execute when user returns back to chat widget. This can happen when user navigated away from chat window before.
        //  This involves two scenario:
        //      1) Chat was in "in-progress" state when user navigated away. This also involves two scenarios:
        //          a) Agent closed the chat after user navigated away from chat. For this scenario, developers have to maintain the state in browser localstorage and verify when needed.
        //          b) Chat is still in in-progress and should be reloaded.
        //      2) Chat was in "closed" state when user navigated away. In this case, start a new chat and set the appropriate state in localstorage.
        // "else" block will execute if user is launching the chat for the first time
        if(WebViewStateHolder.INSTANCE.bundle != null){
            var stateStr: String? = WebViewStateHolder.INSTANCE.bundle?.getString("chatState")
            var state: ChatState? = ChatState.valueOf(stateStr!!.toUpperCase())

            when(state){
                ChatState.INPROGESS -> {
                    // set ChatState to completed if coversation data is not present in localStorage.
                    view.evaluateJavascript("""var isChatClosed = window.localStorage.getItem('IsChatClosed'); if (isChatClosed !== null) {if(isChatClosed === 'true'){Chat.changeChatStateToComplete();localStorage.setItem('IsChatClosed', 'false')}}""", object :
                        ValueCallback<String> {
                        override fun onReceiveValue(value: String) {
                            if(contactusFragment.chatState == ChatState.COMPLETE)
                            {
                                Thread.sleep(100)
                                view.evaluateJavascript("postChatClosureSteps()", null)
                            }
                        }
                    })
                }
                ChatState.COMPLETE ->{
                    startChat(view)
                }
            }
        }
        else{
            // Call startChat() if chat is getting launched for the first time after app was loaded
            startChat(view)
        }

        //Listner for lcw:closeChat event. It triggers when closeChat() is called from customer side.
        view.evaluateJavascript(
            scriptToCloseChat(),
            null)

        //Listner for lcw:threadUpdate. It triggers when agent ends the conversation
        view.evaluateJavascript(
            "window.addEventListener(\"lcw:threadUpdate\", function(){Microsoft.Omnichannel.LiveChatWidget.SDK.closeChat(); })",
            null)
    }

    fun startChat(view: WebView){
        var startChatScript = """                    
                    window.addEventListener(
                    "lcw:ready", 
                    function handleLivechatReadyEvent(){
                        Microsoft.Omnichannel.LiveChatWidget.SDK.startChat();
                        Chat.toggleChatIcon();
                        localStorage.setItem('IsChatClosed', 'false');
                    })
                """.trimIndent()
        view.evaluateJavascript(startChatScript, null)
        contactusFragment.chatState = ChatState.INPROGESS
    }

    fun scriptToCloseChat():String{
        var script = """                    
                    window.addEventListener(
                    "lcw:closeChat",
                    function handleCloseChatEvent(){postChatClosureSteps();})
                """.trimIndent()
        return script
    }

    fun scriptToRunPostChatClosureSteps():String{
        var script = """
                    function appendHtml(el, str) {
                        var div = document.createElement('div');
                        div.innerHTML = str;
                        while (div.children.length > 0) {
                            el.appendChild(div.children[0]);
                        }
                    }
                    function postChatClosureSteps(){
                        localStorage.setItem('IsChatClosed', 'true')
                        Chat.changeChatStateToComplete();
                        Chat.toggleChatIcon();
                        var chatLoadingMessage = document.getElementById("chatLoadingMessage");
                        chatLoadingMessage.style.display = "none";
                        var html = '<p id="chatClosedMessage" style="font-size:.83em; position:absolute; margin: 0; padding: 0; left:50%; top:50%; transform: translateX(-50%) translateY(-50%); text-align: center;">The Conversation has ended. Please start a new chat if you have more questions.</p>';
                        appendHtml(document.body, html);
                    }
                    function displayChatIsLoading(){
                        var html = '<p id="chatLoadingMessage" style="font-size:.83em; position:absolute; margin: 0; padding: 0; left:50%; top:50%; transform: translateX(-50%) translateY(-50%); text-align: center;">The chat is being loaded. <br/> Please Wait!!!</p>';
                        appendHtml(document.body, html);
                    }
                    displayChatIsLoading();
                """.trimIndent()
        return script
    }
}