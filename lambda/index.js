// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

// 起動時
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = `
            <speak>
                ようこそ。このスキルでは、経営者に名前を奪われる主人公の気持ちを味わえます。
                経営者のセリフの後に、あなたの名前を教えてください。では、始めます。
                <break time="1200ms"/>
                <prosody pitch="low" rate="90%">契約書だよ。そこに名前を書きな。</prosody>
            </speak>
            `;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('<prosody pitch="low" rate="90%">契約書だよ。そこに名前を書きな。</prosody>')
            .getResponse();
    }
};

// 名前を奪う
const StealNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'StealNameIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmRetryYesIntent'
            );
    },
    handle(handlerInput) {
        // 応答を組み立て
        speakOutput = '<prosody pitch="low" rate="90%">契約書だよ。そこに名前を書きな。</prosody>';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// 契約書に名前を書く
const WriteNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WriteNameIntent';
    },
    handle(handlerInput) {

        // スロット値を取得
        const name = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Name');
        console.log('スロット値(Name) : ' + name);

        //ランダムに一文字抽出する
        const idx = Math.floor(Math.random() * name.length);
        const newName = name.substring(idx, idx + 1);
        console.log('newName : ' + newName);

        // 返事を組み立て
        const speakOutput = `
            <speak>
                <prosody pitch="low" rate="90%">
                    フン。${name}というのかい。贅沢な名だねぇ。
                    今からお前の名前は${newName}だ。いいかい、${newName}だよ。分かったら返事をするんだ、${newName}!!
                </prosody>
                <break time="1200ms"/>
                あなたの名前は${newName}になりました。もう一度試しますか?
            </speak>
        `;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('もう一度試しますか?')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmRetryNoIntent'
            );
    },
    handle(handlerInput) {
        const speakOutput = 'ご利用ありがとうございました。';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const speakOutput = `想定外の呼び出しが発生しました。もう一度お試しください。`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `エラーが発生しました。もう一度お試しください。`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// リクエストインターセプター(エラー調査用)
const RequestLog = {
    process(handlerInput) {
        //console.log("REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope));
        console.log("HANDLER INPUT = " + JSON.stringify(handlerInput));
        const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
        console.log("REQUEST TYPE =  " + requestType);
        if (requestType === 'IntentRequest') {
            console.log("INTENT NAME =  " + Alexa.getIntentName(handlerInput.requestEnvelope));
        }
        return;
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StealNameIntentHandler,
        WriteNameIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .addRequestInterceptors(RequestLog)
    .lambda();
