function getQueryStringByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let logframe = document.querySelector("div#log");
function logMessage(msg) {
    logframe.innerHTML += "<br />" + msg;
}

class socketrequest {
    constructor() {
        this.socket = null;
        this.sessionid = readCookie("tgn-session");
        this.socket = io.connect(window.location.origin, { 'reconnection': false, query: { session: this.sessionid } } );
    }

    processRequest() {
        let ts = new Date(Date.now()).toUTCString();
        let userId = "";
        let response = null;
        let label = getQueryStringByName("label");
        let dice = getQueryStringByName("dice");
        let diceresult = getQueryStringByName("diceresult");
        let result = getQueryStringByName("result");

        logMessage("Label: " + label);
        logMessage("Dice: " + dice);
        logMessage("Dice Result: " + diceresult);
        logMessage("Result: " + result);

        let msg = `
            <div class="flavor-text">${label}</div>
            <div class="dice-roll">
                <div class="dice-result">
                    <div class="dice-formula">${dice}</div>
                    <div class="dice-tooltip" style="display: none;">
                        <section class="tooltip-part">
                            <div class="dice">
                                <header class="part-header flexrow">
                                    <span class="part-formula">${diceresult}</span>
                                    <span class="part-total">${result}</span>
                                </header>
                                <!--<ol class="dice-rolls">
                                    <li class="roll die d20">9</li>
                                </ol>-->
                            </div>
                        </section>
                    </div>
                    <h4 class="dice-total">${result}</h4>
                    <div>Sent from The Goblin's Notebook</div>
                </div>
            </div>`;

        logMessage("Sending message");
        this.socket.emit(
            "world",
            response => {
                logMessage("got world response");
                userId = response.userId;
                this.socket.emit(
                    "modifyDocument",
                    {
                        "type":
                            "ChatMessage",
                            "action":
                                "create",
                                "data":[{
                                    "user":userId,
                                    "content":msg,
                                    "type":1
                                }]
                    },
                    response => {
                        logMessage("Got modifyDocument response");
                        console.log(response);
                        window.close();
                    }
                );
            }
        );
        
    }
}

s = new socketrequest();
s.processRequest();

/*
"modifyDocument",
    {
        "type":
        "ChatMessage",
        "action":
            "create",
            "data":[{
                "user":"PanmoKZ3Qo9Bs2g0",
                "content":"Message: " + ts,
                "type":1,
                "_id":null,
                "timestamp":null,
                "flavor":"",
                "speaker":{
                    "scene":null,
                    "actor":null,
                    "token":null,
                    "alias":""
                },
                "whisper":[],
                "blind":false,
                "rolls":[],
                "sound":null,
                "emote":false,
                "flags":{}
            }],
            "options":{
                "temporary":false,
                "renderSheet":false,
                "render":true
            }
    }
*/
