# poll-reader

This "bot" allows you to analyse the answers sent to polls in [\[matrix\]](https://matrix.org) rooms.

If, for example, you're using a poll about who needs which T-shirt size and [your matrix client](https://element.io) won't show you who voted on which option, continue reading to find out how to get that info.

## Usage

First, install the dependencies:

```shell
npm install
```

Get an access token to an account that can see the poll and export it in your shell.
Also export that account's homeserver's client-server-API address, which you can find at `https://<your-server-name>/.well-known/matrix/client`.

```shell
export MATRIX_TOKEN="syn_abcde12345"
export HOMESERVER="https://matrix-client.matrix.org"
```

From [your client](https://app.element.io)'s UI, get the [matrix.to](https://matrix.to) link to the event by selecting *share* and make sure the *link to selected message* box is ticked.

Then call the bot with a command like such as the following, passing the link as the first argument.
If your terminal or shell escapes pasted strings such as my does, it still works regardless.

```shell
node bot.js 'https://matrix.to/\#/\!ouWJizOXmgggWACwar:gruenhage.xyz/$sSh6rhmhzK5wLAcgQ62yIrU1QQ8UmBhfIqoJX1Mo3w8\?via\=amorgan.xyz\&via\=matrix.org\&via\=element.io'
```

It will download the poll event, especially the answer options, and the related answer events. It will filter the answers to be unique per users by picking the latest one, since currently with Element you can only have polls where everyone can answer only once.

It will then sort the results by the picked answer and print the list of users for each selected answer in the same order as given in the question.

## To Do

This is a POC:
Notably, pagination of all the poll answers is missing.
So if your poll has a lot of answers, we will only look at the latest 100 of them as returned by the server.
