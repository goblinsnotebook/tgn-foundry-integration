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
function emitChatMessage(userId, chatMessage, total, private) {
    logMessage("Sending ChatMessage");
    let chatMsg = {
            "type":"ChatMessage",
            "action": "create",
            "operation": {
                "render": true,
                "renderSheet": false,
                "rollMode": private ? "selfroll" : "publicroll",
                "data":[{
                    "author":userId,
                    "content":chatMessage,
                    "type":"base",
                    "sound": "sounds/dice.wav",
                    "whisper": private ? [userId] : [],
                    "rolls": [`{"terms":[],"total":${total},"evaluated":true}`]
                }]
            }
        };
    console.log(chatMsg);
    socket.emit(
        "modifyDocument",
        chatMsg,
        response => {
            logMessage("Got modifyDocument response");
            socket.close();
            window.close();
        }
    );
}

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
let crit = getQueryStringByName("crit");
let private = getQueryStringByName("priv") === "1";

if (crit == "s") { crit = " success"; }
if (crit == "f") { crit = " failure"; }

logMessage("User: " + user);
logMessage("Label: " + label);
logMessage("Dice: " + dice);
logMessage("Dice Result: " + diceresult);
logMessage("Result: " + result);
logMessage("Crit: " + crit);
logMessage("Private: " + private);

let formula = dice == "" ? "" : `<div class="dice-formula">${dice}</div>`;
let msg = `
    <div class="flavor-text">${label}</div>
    <div class="dice-roll tgn">
        <div class="dice-result">
            ${formula}
            <div class="dice-tooltip-collapser">
                <div class="dice-tooltip" >
                    <section class="tooltip-part">
                        <div class="dice">
                           <span class="tgn part-formula">${diceresult}</span>
                        </div>
                    </section>
                </div>
            </div>
            <h4 class="dice-total${crit}">${result}</h4>
            <div class="footer">Rolled from The Goblin's Notebook</div>
        </div>
    </div>`;

if (user != "" && user != null) {
    emitChatMessage(user, msg, result, private);
} else {
    logMessage("Sending world message");
    socket.emit(
        "world",
        response => {
            logMessage("got world response");
            user = response.userId;
            emitChatMessage(user, msg, result, private);
        }
    );
}
