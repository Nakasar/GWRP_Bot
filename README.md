# Bot'Baddon

Your favorite discord bot for role-playing communities on Guild Wars 2!

## Invite the bot.

Click [here](https://discordapp.com/api/oauth2/authorize?client_id=474598943804620801&scope=bot&permissions=36961344) to add the bot to your server.

## Installation

To run the Bot'Baddon, you'll need to create first a discord bot profile.
Head to the [developer section of the discord website](https://discordapp.com/developers/applications) to create the bot.
Create and note the bot token, this is the most important information required to start the bot.

Also, keep the bot client ID, this is how you'll invite your bot later by following this link:

```
https://discordapp.com/api/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=36961344
```

### Local runtime

If you intend to run the bot for trying and development, create a `./config/local.json` file with the following json:

```json
{
  "token": "---> BOT_TOKEN <---"
}
```

Then, install node dependencies with `npm install` (you should probably learn a bit about javascript and nodejs before doing anything).

Finally, execute `npm start` to run the bot. Invite the bot into one of your server and you're good to talk to Bot'Baddon! 

### Production runtime

To run the bot for production, you should use a docker container.

First, build the docker image:
 
```
docker build -t nakasar/botbaddon:latest
```

Then, run the container:

```
docker run -e BOT_TOKEN=your_bot_token --name botbaddon -d nakasar/botbaddon:latest
```

