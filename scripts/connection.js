function getQueryStringByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function logMessage(msg) {
    logframe.innerHTML += "<br />" + msg;
}
function emitChatMessage(userId, chatMessage) {
    logMessage("Sending ChatMessage");
    socket.emit(
        "modifyDocument",
        {
            "type":
                "ChatMessage",
                "action":
                    "create",
                    "data":[{
                        "user":userId,
                        "content":chatMessage,
                        "type":1
                    }]
        },
        response => {
            logMessage("Got modifyDocument response");
            socket.close();
            window.close();
        }
    );
}

//let sessionid = readCookie("tgn-session");
let sessionid = readCookie("session");
let socket = io.connect(window.location.origin, {
    upgrade: false,
    reconnection: true,
    query: { 
        session: sessionid
    }
} );

let logframe = document.querySelector("div#log");
let ts = new Date(Date.now()).toUTCString();
let response = null;
let user = getQueryStringByName("user");
let label = getQueryStringByName("label");
let dice = getQueryStringByName("dice");
let diceresult = getQueryStringByName("diceresult");
let result = getQueryStringByName("result");

logMessage("User: " + user);
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
                    </div>
                </section>
            </div>
            <h4 class="dice-total">${result}</h4>
            <div>Sent from The Goblin's Notebook</div>
        </div>
    </div>`;

/*
<ol class="dice-rolls">
    <li class="roll die d20">20</li>
</ol>
*/

if (user != "" && user != null) {
    emitChatMessage(user, msg);
} else {
    logMessage("Sending world message");
    socket.emit(
        "world",
        response => {
            logMessage("got world response");
            user = response.userId;
            emitChatMessage(user, msg);
        }
    );
}


        

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
