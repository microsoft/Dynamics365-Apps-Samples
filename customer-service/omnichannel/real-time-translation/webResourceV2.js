/* 

(!) Important
Microsoft provides the sample script as a guide only. Use the sample script to enable real-time translation in Omnichannel for Customer Service.

Microsoft provides the sample script "as is," "with all faults," and without warranty of any kind.  Microsoft does not provide any support for your use of the sample script.  If Microsoft does elect to provide support for your use of the sample script, then such support is also provided "as is," "with all faults," and without warranty of any kind and may be discontinued at any time at Microsoft's sole discretion.
 
If you use the sample script and enable data collection in your applications, you must comply with applicable law, including getting any required user consent before tracking (or otherwise collecting data from) your users, and maintain a prominent privacy policy that accurately informs users about how you use, collect, and share their data.  
 
You can learn about Microsoft’s own data collection and use in the applicable product documentation and the Microsoft Privacy Statement at http://go.microsoft.com/fwlink/?LinkID=521839.  You agree to comply with all applicable provisions of the Microsoft Privacy Statement.


*/

var C1WebResourceNamespace = {

	dictForAllConversation: {},
	bingTranslateApiClientSecret: '<please add your own azure translation api key>',
	googleTranslateApiClientSecret: '<please add your own google translation v2 api key>',
	useAzureTranslationApis: true,//please override it to false if planning to use google translation v2 api
	messageBuffer: new Map(),
	enableLanguageDetectionWithHistoryMessages: false,
	
	//ISO 639-1 language code. It is supported by Azure Cognitive Translate API and Google V2 translation API
	ISO6391LanguageCodeToOcLanguageCodeMap: {
		'gu': ['71', '1095'],
		'gd': ['1169'],
		'ga': ['2108'],
		'gl': ['86', '1110'],
		'lb': ['1134'],
		'tn': ['1074'],
		'lo': ['1108'],
		'tt': ['68', '1092'],
		'tr': ['31', '1055'],
		'lv': ['38', '1062'],
		'lt': ['39', '1063'],
		'tk': ['1090'],
		'th': ['30', '1054'],
		'tg': ['1064'],
		'te': ['74', '1098'],
		'fil': ['1124','100'],
		'ta': ['73', '1097'],
		'yo': ['1130'],
		'de': ['7', '3079', '2055', '1031', '5127', '4103'],
		'da': ['6', '1030'],
		'moh': ['1148'],
		'dv': ['101', '1125'],
		'el': ['8', '1032'],
		'en': ['9', '9225', '3081', '10249', '4105', '2057', '6153', '16393', '8201', '17417', '5129', '13321', '18441', '11273', '1033', '7177', '12297'],
		'zh': ['4', '31748', '2052', '3076', '5124', '4100', '1028'],
		'uk': ['34', '1058'],
		'eu': ['45', '1069'],
		'et': ['37', '1061'],
		'arn': ['1146'],
		'ba': ['1133'],
		'ru': ['25', '1049'],
		'rw': ['1159'],
		'quz': ['1131', '2155', '3179'],
		'sms': ['8251'],
		'smn': ['9275'],
		'smj': ['4155', '5179'],
		'rm': ['1047'],
		'ro': ['24', '1048'],
		'dsb': ['2094'],
		'sma': ['6203', '7227'],
		'hsb': ['1070'],
		'be': ['35', '1059'],
		'bg': ['2', '1026'],
		'qut': ['1158'],
		'wo': ['1160'],
		'bn': ['2117', '1093'],
		'bo': ['1105'],
		'br': ['1150'],
		'bs': ['8218', '5146'],
		'ja': ['17', '1041'],
		'syr': ['90', '1114'],
		'oc': ['1154'],
		'or': ['1096'],
		'xh': ['1076'],
		'co': ['1155'],
		'nso': ['1132'],
		'ca': ['3', '1027'],
		'cy': ['1106'],
		'cs': ['5', '1029'],
		'ps': ['1123'],
		'kok': ['87', '1111'],
		'pt': ['22', '1046', '2070'],
		'pa': ['70', '1094'],
		'vi': ['42', '1066'],
		'pl': ['21', '1045'],
		'hy': ['43', '1067'],
		'hr': ['26', '4122', '1050'],
		'iu': ['1117', '2141'],
		'hu': ['14', '1038'],
		'hi': ['57', '1081'],
		'ha': ['1128'],
		'he': ['13', '1037'],
		'uz': ['67', '2115', '1091'],
		'ml': ['1100','76'],
		'mn': ['80', '1104', '2128'],
		'mi': ['1153'],
		'mk': ['47', '1071'],
		'ur': ['32', '1056'],
		'mt': ['1082'],
		'ms': ['62', '2110', '1086'],
		'mr': ['78', '1102'],
		'ug': ['1152'],
		'sah': ['1157'],
		'af': ['54', '1078'],
		'sw': ['65', '1089'],
		'is': ['15', '1039'],
		'am': ['1118'],
		'it': ['16', '2064', '1040'],
		'sv': ['29', '2077', '1053'],
		'ii': ['1144'],
		'as': ['1101'],
		'ar': ['1', '14337', '15361', '5121', '3073', '2049', '11265', '13313', '12289', '4097', '6145', '8193', '16385', '1025', '10241', '7169', '9217'],
		'prs': ['1164'],
		'zu': ['1077'],
		'az': ['44', '2092', '1068'],
		'tzm': ['2143'],
		'id': ['33', '1057'],
		'ig': ['1136'],
		'nl': ['19', '2067', '1043'],
		'nn': ['2068'],
		'no': ['20'],
		'nb': ['1044'],
		'ne': ['1121'],
		'es': ['10', '11274', '16394', '13322', '9226', '5130', '7178', '12298', '3082', '4106', '18442', '2058', '19466', '6154', '10250', '20490', '15370', '17418', '21514', '14346', '8202', '1034'],
		'fr': ['12', '2060', '3084', '4108', '1036', '5132', '6156'],
		'fy': ['1122'],
		'fa': ['41', '1065'],
		'fi': ['11', '1035'],
		'sa': ['79', '1103'],
		'fo': ['56', '1080'],
		'ka': ['55', '1079'],
		'gsw': ['1156'],
		'kk': ['63', '1087'],
		'sr': ['31770', '7194', '3098', '12314', '10266', '6170', '2074', '11290', '9242'],
		'sq': ['28', '1052'],
		'ko': ['18', '1042'],
		'kn': ['75', '1099'],
		'km': ['1107'],
		'kl': ['1135'],
		'sk': ['27', '1051'],
		'si': ['1115'],
		'sl': ['36', '1060'],
		'ky': ['64', '1088'],
		'se': ['3131', '1083', '2107'],		
		'yue':['1166'],
		'zh-Hans':['4'],
	    	'zh-Hant':['31748'],
	    	'fj':['4096'],
	    	'fr-ca':['3084'],
	    	'ht':['15372'],  
	    	'ku':['146'],
	    	'mg':['1000'],
	    	'ms':['62'],
	    	'my':['85'],
	    	'pt-pt':['2070'],
	    	'sr-Cyrl':['27674'],
	    	'sr-Latn':['28698'],
	    	'ti':['115'],
	    	'to':['4096']		
	},

	//converts iso 639-1 language code to locale id. Example- "en" -> 1033 for english
	getOcLanguageCodeMapFromISO6391LanguageCode: function (ISO6391LanguageCode) {
		var lanCode = ISO6391LanguageCode; //ISO6391LanguageCode,, used when oc language code is not found
		if (ISO6391LanguageCode in C1WebResourceNamespace.ISO6391LanguageCodeToOcLanguageCodeMap)
			lanCode = C1WebResourceNamespace.ISO6391LanguageCodeToOcLanguageCodeMap[ISO6391LanguageCode][0];
		return lanCode;
	},

	//converts locale id language code to iso 639-1. Example- 1031 -> "de" for german
	getISO6391LanguageCodeFromOcLanguageCode: function (ocLanguageCode) {
		var ISO6391LanCode = "invalid code"; //invalid code
		ISO6391LanCode = "en";
		for (var key in C1WebResourceNamespace.ISO6391LanguageCodeToOcLanguageCodeMap) {
			if (C1WebResourceNamespace.ISO6391LanguageCodeToOcLanguageCodeMap[key].includes(ocLanguageCode)) {
				ISO6391LanCode = key;
				break;
			}
		}
		return ISO6391LanCode;
	},

	//saves the c2 langauge to CDS's contextVariable table for the given conversation.
	//So, that it is remembered across multiple transfers for same conversation
	//i.e. it is shared with multiple agents during transfer of conversation
	upsertC2LanguageInCRM: function (conversationId, c2Lang) {
		var data = {
			"msdyn_value": c2Lang,
			"msdyn_name": "msdyn_C2_language",
			"statecode": 0,
			"statuscode": 1,
			"msdyn_isdisplayable": true,
			"msdyn_ocliveworkitemid@odata.bind": "/msdyn_ocliveworkitems(" + conversationId + ")"
		};
		consoleLogHelper(conversationId, "Before upserting C2 Language in CRM", {
			c2Lang,
			dictionary: C1WebResourceNamespace.dictForAllConversation[conversationId],
			data
		});
		if (C1WebResourceNamespace.dictForAllConversation[conversationId]['msdyn_C2_language_id'] == null) {
			// create record
			window.top.Xrm.WebApi.createRecord("msdyn_ocliveworkitemcontextitem", data).then(
				function success(result) {
					consoleLogHelper(conversationId, "created msdyn_ocliveworkitemcontextitem when msdyn_C2_language_id is null", {
						result
					});
					C1WebResourceNamespace.dictForAllConversation[conversationId]['msdyn_C2_language_id'] = String(result.id);
				},
				function (error) {
					consoleLogHelper(conversationId, "Failed to create msdyn_ocliveworkitemcontextitem", error, true);
					// handle error conditions
				}
			);
		} else {
			// update record
			window.top.Xrm.WebApi.updateRecord("msdyn_ocliveworkitemcontextitem", C1WebResourceNamespace.dictForAllConversation[conversationId]['msdyn_C2_language_id'], data).then(
				function success(result) {
					consoleLogHelper(conversationId, "updated msdyn_ocliveworkitemcontextitem", {
						result
					});
				},
				function (error) {
					consoleLogHelper(conversationId, "Failed to update msdyn_ocliveworkitemcontextitem", error, true);
					// handle error conditions
				}
			);
		}
	},

	//called when a converation is opened/ accepted before start of the chat.
	//this tells if the translation needs to be turned on or off for the conversation.
	initializeNewConversationInWebResource: async function (conversationConfig) {
		var conversationId = conversationConfig.conversationId;
		var c1Language = C1WebResourceNamespace.getISO6391LanguageCodeFromOcLanguageCode(String(conversationConfig.c1Language));
		consoleLogHelper(conversationId, "Received translation request", {
			conversationConfig,
			c1Language
		});
		//error handling if invalid language is found
		if (c1Language == "invalid code") {
			consoleLogHelper(conversationId, "Invalid c1Language found");
				return Promise.resolve({
					keepTranslationOn: false
				});
		}
		var dataObject = {}
		//get C2 language- start
		var finalC2lang = null;
		var finalC2langId = null;

		if (conversationConfig.inviteParams && conversationConfig.inviteParams.inviteLocale) {
			finalC2lang = C1WebResourceNamespace.getISO6391LanguageCodeFromOcLanguageCode(conversationConfig.inviteParams.inviteLocale);
		}
		consoleLogHelper(conversationId, "Determined C2 language code", {
			finalC2lang
		});
		if (finalC2lang == "invalid code"){
			consoleLogHelper(conversationId, "Invalid finalC2lang found");
			return Promise.resolve({
				keepTranslationOn: false
			});
		}
		var engine = "azure";
		if(C1WebResourceNamespace.useAzureTranslationApis == false)
			engine = "google";
		try {
			//check if CDS already know the C2 language for the conversation and if found use it.
			var finalC2langPromiseRecord = window.top.Xrm.WebApi.retrieveMultipleRecords("msdyn_ocliveworkitemcontextitem", "?$select=msdyn_value,msdyn_name&$filter=_msdyn_ocliveworkitemid_value eq '" + conversationId + "' and msdyn_name eq 'msdyn_C2_language'");

			var finalC2langPromise = await finalC2langPromiseRecord;
			consoleLogHelper(conversationId, "Loaded msdyn_ocliveworkitemcontextitem", {
				fetchedResult: finalC2langPromise
			});
			for (var i = 0; i < finalC2langPromise.entities.length; i++) {
				if (finalC2langPromise.entities[i]['msdyn_name'] == "msdyn_C2_language") {
					finalC2lang = finalC2langPromise.entities[i]['msdyn_value'];
					finalC2langId = finalC2langPromise.entities[i]['msdyn_ocliveworkitemcontextitemid'];
				}
			}
		} catch (err) {
			consoleLogHelper(conversationId, "Failed retrieve msdyn_ocliveworkitemcontextitem", err, true);
		}

		var dictForThisConversation = {
			'finalC2Lang': finalC2lang,
			'C1Lang': c1Language,
			'C1LangLocaleCode': String(conversationConfig.c1Language),// saving original c1 langauge code
			//which came as input
			'ConfigData': dataObject,
			'msdyn_C2_language_id': finalC2langId,
			'engine': engine
		};
		//save important contextual data about this conversation for future reference in the code
		C1WebResourceNamespace.dictForAllConversation[conversationId] = dictForThisConversation;
		consoleLogHelper(conversationId, "Updated dictionary config", {
			dict: C1WebResourceNamespace.dictForAllConversation[conversationId]
		});
		if (finalC2langId == null && finalC2lang != null) {
			C1WebResourceNamespace.upsertC2LanguageInCRM(conversationId, finalC2lang);
		}
		var initResult;
		//here we are turning off translation when c1 and c2 are of same langauge
		if (c1Language == finalC2lang) {
			initResult = {
				keepTranslationOn: false
			};
		} else {
			initResult = {
				keepTranslationOn: true
			};
		}
		consoleLogHelper(conversationId, "Returning conversation init result", {
			initResult
		})
		return initResult;
	},
	
	//This method provides the translation of given message for a given conversation.
	//It also provides the message's source language along with the language the message has been translated to.
	translateMessageInWebResource: function (translationConfig) {
		var conversationId = translationConfig.conversationId;
		var sourceLang = null;
		var destLang = null;
		consoleLogHelper(conversationId, "Invoking translateMessageInWebResource", {
			translationConfig
		})
		var message = {
			text: translationConfig.messagePayload.content,
			sender: translationConfig.messagePayload.sender.userType
		};
		var translateToC1orC2 = translationConfig.translateToC1orC2;
		// While translating for C1 as we want to use auto detection of langauge for the incoming message.
		// We should set the sourceLang if we already known the finalC2Language to avoid message change in the middle of the conversation
		// the drawback for this approach is, if the detection of the language is wrong in the beginning, there is no way to correct it afterwards.
		if (translateToC1orC2 == Microsoft.Omnichannel.TranslationFramework.TranslateTo.C1) {
			destLang = C1WebResourceNamespace.dictForAllConversation[conversationId]['C1Lang']; 
		}
		// While translating for C2 as we know the C1 language so source langauge is c1's language.
		if (translateToC1orC2 == Microsoft.Omnichannel.TranslationFramework.TranslateTo.C2) {
			sourceLang = C1WebResourceNamespace.dictForAllConversation[conversationId]['C1Lang'];
			destLang = C1WebResourceNamespace.dictForAllConversation[conversationId]['finalC2Lang']; //it can still remain null. When we have no idea about C2 language
		}
		consoleLogHelper(conversationId, "Determined source and dest language", {
			sourceLang,
			destLang
		})
		var response = null;
		//decides which transalation engine's api to call based on config set in initializeNewConversationInWebResource method
		if (C1WebResourceNamespace.dictForAllConversation[conversationId]['engine'] == 'azure')
			response = C1WebResourceNamespace.translateMessageInternalAzure(conversationId, message["text"], message['sender'], sourceLang, destLang);
		else
			response = C1WebResourceNamespace.translateMessageInternalGoogle(conversationId, message["text"], message['sender'], sourceLang, destLang);
		response.then((value) => {
			consoleLogHelper(conversationId, "Translation result received", {
				value
			});
			if (value.sourceLanguage == value.destinationLanguage) {
				value.sourceLanguage = C1WebResourceNamespace.dictForAllConversation[conversationId]['C1LangLocaleCode'];//replacing the current code with original C1 language code which came during initialization of new conversation
				value.destinationLanguage = C1WebResourceNamespace.dictForAllConversation[conversationId]['C1LangLocaleCode'];//replacing the current code with original C1 language code which came during initialization of new conversation
			} else if (translateToC1orC2 == Microsoft.Omnichannel.TranslationFramework.TranslateTo.C1) {
				value.destinationLanguage = C1WebResourceNamespace.dictForAllConversation[conversationId]['C1LangLocaleCode'];//replacing the current code with original C1 language code which came during initialization of new conversation
			} else if (translateToC1orC2 == Microsoft.Omnichannel.TranslationFramework.TranslateTo.C2) {
				value.sourceLanguage = C1WebResourceNamespace.dictForAllConversation[conversationId]['C1LangLocaleCode'];//replacing the current code with original C1 language code which came during initialization of new conversation
			}
			consoleLogHelper(conversationId, "Dumpping the latest dictionary and value", {
				dict: C1WebResourceNamespace.dictForAllConversation[conversationId],
				value
			});
			return value;
		});
		return response;
	},

	updateC2Language: function (conversationId, detectedLang) {
		var currentC2Language = C1WebResourceNamespace.dictForAllConversation[conversationId]?.['finalC2Lang'];
		if (currentC2Language !== detectedLang) {
			consoleLogHelper(conversationId, "Updating detected language", {
				dict: C1WebResourceNamespace.dictForAllConversation[conversationId],
				conversationId,
				detectedLang
			})
			C1WebResourceNamespace.dictForAllConversation[conversationId]['finalC2Lang'] = detectedLang;
			C1WebResourceNamespace.upsertC2LanguageInCRM(conversationId, detectedLang);
		}
	},

	//https://docs.microsoft.com/en-us/azure/cognitive-services/translator/reference/v3-0-translate
	translateMessageInternalAzure: async function (conversationId, message, messageSender, sourceLang, destLang) {
		var errorObj = {
			isError: false,
			errorCode: null
		};
		consoleLogHelper(conversationId, "Trigger translateMessageInternalAzure", {
			message,
			messageSender,
			sourceLang,
			destLang
		})
		//when we do not have even a single clue about C2's lang and c1 wants to send him message so destlang == null
		if (destLang == null || sourceLang == destLang)
			return {
				translatedMessage: message,
				destinationLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(sourceLang)),
				errorObject: errorObj,
				sourceLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(sourceLang))
			};

		var url = ""
		if (sourceLang == null) {
			url = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + destLang;
		} else {
			url = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=" + sourceLang + "&to=" + destLang;
		}
		//translation happens here by calling api for translation engine
		var myJson = null;
		try {
			var bodyObj = [];
			bodyObj[0] = new Object();
			bodyObj[0].Text = message;
			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(bodyObj), // string or object
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Ocp-Apim-Subscription-Key': C1WebResourceNamespace.bingTranslateApiClientSecret
				}
			});
			consoleLogHelper(conversationId, "Making translation request to Azure", {
				url,
				bodyObj
			})
			myJson = await response.json();
		} catch (err) {
			// add errorMessage and rawError to the errorObj so it can be logged internally for troubleshooting
			var errorObj = {
				isError: true,
				errorCode: Microsoft.Omnichannel.TranslationFramework.ErrorCodes.TRANSLATION_FAILED,
				errorMessage: err.message,
				rawError: err
			};
			consoleLogHelper(conversationId, "Failed to post request for translation from Azure", err, true);
			return {
				translatedMessage: null,
				destinationLanguage: null,
				errorObject: errorObj,
				sourceLanguage: null
			};
		}
		consoleLogHelper(conversationId, "Received translation response from Azure", {
			myJson
		})
		//detect langauge only if sender is C2 
		if (sourceLang == null && messageSender == Microsoft.Omnichannel.TranslationFramework.UserType.C2) {
			var detectedLang = myJson[0]['detectedLanguage']["language"];
			var detectedLangScore = myJson[0]['detectedLanguage']["score"];
			var highestScoredC2Language = C1WebResourceNamespace.getHighestScoredC2Language(conversationId, myJson[0]);
			var currentC2Language = C1WebResourceNamespace.dictForAllConversation[conversationId]?.['finalC2Lang'];
			var languageUsedForUpdate = detectedLang;
			if (detectedLangScore > 0.6 && currentC2Language != languageUsedForUpdate) {
				if (this.enableLanguageDetectionWithHistoryMessages && highestScoredC2Language?.language) {
					var highestScoredC2Language = highestScoredC2Language;
					if (highestScoredC2Language?.language === languageUsedForUpdate ) {
						consoleLogHelper(conversationId, "History message score based evaluation is enabled, the hightest scored language is matching detected language", {
							dict: C1WebResourceNamespace.dictForAllConversation[conversationId],
							highestScoredC2Language
						});
					}
					else {
						consoleLogHelper(conversationId, "History message score based evaluation is enabled, the hightest scored language is used to update", {
							dict: C1WebResourceNamespace.dictForAllConversation[conversationId],
							highestScoredC2Language,
							currentC2Language
						});
						languageUsedForUpdate = highestScoredC2Language.language;
					}
				}
				C1WebResourceNamespace.updateC2Language(conversationId, languageUsedForUpdate);
			}
		}
		if (sourceLang == null) {
			sourceLang = myJson[0]['detectedLanguage']["language"];
		}
		var result = {
			translatedMessage: myJson[0]['translations'][0]['text'],
			destinationLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(myJson[0]['translations'][0]['to'])),
			errorObject: errorObj,
			sourceLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(sourceLang))
		};
		consoleLogHelper(conversationId, "Returning translation result from Azure translator", {
			result
		});
		return result;
	},

	////https://cloud.google.com/translate/docs/reference/rest/v2/translate
	translateMessageInternalGoogle: async function (conversationId, message, messageSender, sourceLang, destLang) {
		var errorObj = {
			isError: false,
			errorCode: null
		};
		consoleLogHelper(conversationId, "Trigger translateMessageInternalGoogle", {
			message,
			messageSender,
			sourceLang,
			destLang
		})
		//when we do not have even a single clue about C2's lang and c1 wants to send him message so destlang == null
		if (destLang == null || sourceLang == destLang)
			return {
				translatedMessage: message,
				destinationLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(sourceLang)),
				errorObject: errorObj,
				sourceLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(sourceLang))
			};

		var url = "https://translation.googleapis.com/language/translate/v2?format=text&key=" + C1WebResourceNamespace.googleTranslateApiClientSecret + "&target=" + destLang + "&q=" + message;
		//translation happens here by calling api for translation engine
		if (sourceLang == null) {
			url = url;
		} else {
			url = url + "&source=" + sourceLang;
		}
		var myJson = null;
		try {
			const response = await fetch(url, {
				method: 'POST'
			});
			consoleLogHelper(conversationId, "Making translation request to Google", {
				url
			})
			myJson = await response.json();
		} catch (err) {
			consoleLogHelper(conversationId, "Failed to post request for translation from Google", err, true);
			// add errorMessage and rawError to the errorObj so it can be logged internally for troubleshooting
			var errorObj = {
				isError: true,
				errorCode: Microsoft.Omnichannel.TranslationFramework.ErrorCodes.TRANSLATION_FAILED,
				errorMessage: err.message,
				rawError: err
			};
			return {
				translatedMessage: null,
				destinationLanguage: null,
				errorObject: errorObj,
				sourceLanguage: sourceLang
			};
		}

		//detect langauge only if sender is C2 
		if (sourceLang == null && messageSender == Microsoft.Omnichannel.TranslationFramework.UserType.C2) {
			var detectedLang = myJson['data']["translations"][0]["detectedSourceLanguage"];
			if (C1WebResourceNamespace.dictForAllConversation[conversationId]['finalC2Lang'] != detectedLang) {
				C1WebResourceNamespace.dictForAllConversation[conversationId]['finalC2Lang'] = detectedLang;
				consoleLogHelper(conversationId, "Updating detected language", {
					dict: C1WebResourceNamespace.dictForAllConversation[conversationId]
				})
				C1WebResourceNamespace.upsertC2LanguageInCRM(conversationId, detectedLang);
			}
		}
		if (sourceLang == null) {
			sourceLang = myJson['data']["translations"][0]["detectedSourceLanguage"];
		}
		var result = {
			translatedMessage: myJson['data']["translations"][0]["translatedText"],
			destinationLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(destLang)),
			errorObject: errorObj,
			sourceLanguage: C1WebResourceNamespace.getOcLanguageCodeMapFromISO6391LanguageCode(String(sourceLang))
		};
		consoleLogHelper(conversationId, "Returning translation result from Google translator", {
			result
		});
		return result;
	},
	/*
		For every conversation, create an array to store up to 50 messages, shift the array and always append the message at the end of the array
		When a new message added, always append to the end of the array with info of auto-detected language and score.
		After adding the message, calculating the accumulated score for all the messages for a certain language.
		For example:
		If the message buffer contains:
		[
			0: {language: "en", score: "0.6"},
			1: {language: "en", score: "0.7"},  
		]
		When a new message arrives with {language: "fr", score: "0.6"}
		The score for "en" would be calculated as: Sum(index * score)
		(0+1) * 0.6 + (1+1) * 0.7 = 2
		The score for "fr" would be calculated as:
		(2+1) * 0.6 = 1.8
		Note: always adding "1" to the index to avoid multiplying by "0"
		In this case, the customer language is still more preferred as "en" instead of the last arrived language "fr"
	*/
	getHighestScoredC2Language: function(conversationId, translationResult) {
		if (!translationResult || !this.enableLanguageDetectionWithHistoryMessages) {
			return null;
		}
		if (!C1WebResourceNamespace.messageBuffer.get(conversationId)) {
			C1WebResourceNamespace.messageBuffer.set(conversationId, []);
		}
		let messageBufferForConversation = C1WebResourceNamespace.messageBuffer.get(conversationId);

		if (messageBufferForConversation.length >= 50) {
			messageBufferForConversation.shift();
		}

		if (translationResult.detectedLanguage) {
			messageBufferForConversation.push(translationResult.detectedLanguage);
		}
		let messageScoreMap = new Map();
		let languageWithHighestScore = null;
		for (let bufferedMessageIndex = 0; bufferedMessageIndex < messageBufferForConversation.length; bufferedMessageIndex ++ ) {
			const bufferedMessage = messageBufferForConversation[bufferedMessageIndex];
			
			if (!messageScoreMap.get(bufferedMessage.language)) {
				messageScoreMap.set(bufferedMessage.language, 0); 
			}
			const score = messageScoreMap.get(bufferedMessage.language) + bufferedMessage.score * (bufferedMessageIndex + 1); //always add 1 to avoid multiplying by 0
			messageScoreMap.set(bufferedMessage.language, score);

			if (!languageWithHighestScore) {
				languageWithHighestScore = {
					language: bufferedMessage.language,
					totalScore: score
				}
			}
			else {
				if (score > languageWithHighestScore.totalScore) {
					languageWithHighestScore.language = bufferedMessage.language;
					languageWithHighestScore.totalScore = score;
				}
			}
		}
		return languageWithHighestScore;
	}
};

function consoleLogHelper(conversationId, message, data={}, isError=false) {
	try {
		if (isError) {
			console.error(`${new Date().toISOString()}, ${conversationId}, ${message}`, data);
		}
		else {
			let dataStr = stringifyHelper(data);
			if (dataStr.length > 1000) {
				//only logging first 1000 character
				dataStr = dataStr.substring(0, 1000);
			}
			console.log(`${new Date().toISOString()}, ${conversationId}, ${message}, ${dataStr}`);
		}
	} catch (error) {
		console.error("Failed to log console log", error);
	}
}

function stringifyHelper(obj) {
	let result = "";
	try {
		if (typeof obj === "string") {
			return obj;
		}
		let tempResult = JSON.stringify(obj);
		if (tempResult !== undefined && tempResult !== null) {
			result = tempResult;
		}
	}
	catch (e) {
		console.error("failed to stringify: error:", e);
	}
	return result;
}

//registering the methods which Omnichannel will call for translating messages for a given conversation
window.Microsoft.Omnichannel.TranslationFramework.getTranslationProvider = function () {
	return {
		initializeNewConversation: C1WebResourceNamespace.initializeNewConversationInWebResource,
		translateMessage: C1WebResourceNamespace.translateMessageInWebResource
	}
};