import {
    MatrixClient,
    SimpleFsStorageProvider,
    AutojoinRoomsMixin,
    RustSdkCryptoStorageProvider,
} from "matrix-bot-sdk";

// This will be the URL where clients can reach your homeserver. Note that this might be different
// from where the web/chat interface is hosted. The server must support password registration without
// captcha or terms of service (public servers typically won't work).
const homeserverUrl = "https://matrix-client.matrix.org";

// Use the access token you got from login or registration above.
const accessToken = process.env.MATRIX_TOKEN;

const storageProvider = new SimpleFsStorageProvider("./data/bot.json"); // or any other IStorageProvider

// Finally, let's create the client and set it to autojoin rooms. Autojoining is typical of bots to ensure
// they can be easily added to any room.
const client = new MatrixClient(homeserverUrl, accessToken, storageProvider);
AutojoinRoomsMixin.setupOnClient(client);

// Now that everything is set up, start the bot. This will start the sync loop and run until killed.
await client.start() //.then(() => console.log("Bot started!"));

const eventlink = process.argv[2];
if (!eventlink) throw new Error("no event id provided");
// console.log(eventlink);

const [eventid] = eventlink.match(/\$\w+/)
// console.log("Event ID:", eventid)

const [roomid] = eventlink.match(/\![\w.:]+/)
// console.log("Room ID:", roomid)

const event = await client.getEvent(roomid, eventid)
// console.log(event)
// console.log(event.content['org.matrix.msc3381.poll.start'].answers)
const answers = {}
for (const a of event.content['org.matrix.msc3381.poll.start'].answers) {
    answers[a.id] = a['org.matrix.msc1767.text']
}

const votes = await client.doRequest("GET", `/_matrix/client/v1/rooms/${roomid}/relations/${eventid}/m.reference/org.matrix.msc3381.poll.response`, {"limit": 100})
// console.log(votes)
// console.log(votes.chunk[0].content)

const sortedvotes = {}
Object.values(answers).forEach((a) => sortedvotes[a] = [])

for (const v of votes.chunk) {
    const answer = answers[v.content['org.matrix.msc3381.poll.response'].answers[0]]
    if (!(answer in sortedvotes)) sortedvotes[answer] = []
    let existingUsers = []
    for (const arr of Object.values(sortedvotes)) {
        existingUsers = [...existingUsers, ...arr]
    }
    if (!existingUsers.includes(v.user_id)) {
        sortedvotes[answer].push(v.user_id)
    }
}
console.log(sortedvotes)

// 'org.matrix.msc3381.poll.response': { answers: [ '371DY9oOQod8j72f' ] }
// { id: 'aypiri0mrUu5CfuX', 'org.matrix.msc1767.text': 'S' },

client.stop()
process.exit(0)
