const {
    Client
} = require("discord.js");
let pkg = require('../package.json');
const editJsonFile = require("edit-json-file");

module.exports = {
    name: "ready",
    /**
     * @param {Client} client 
     */
    execute(client) {
        let file = editJsonFile("./data/data.json");
        console.log(`${pkg.name} (${pkg.license}) made by ${pkg.author}\nCurrent version: ${pkg.version}\n${!parseInt(process.env.TEMP_TEST)? 'Normal working condition': 'Temporary testing condition'}`);
        
        client.user.setPresence({
            status: "online",
            activities: [{
                name: file.get('title'),
                type: "PLAYING"
            }]
        });

        if(parseInt(process.env.TEMP_TEST)){
            client.guilds.cache.get(process.env.GUILD_ID).commands.set(client.arrayOfSlashCommands);
        }
        else {
            client.guilds.cache.get(process.env.GUILD_ID).commands.set([]);
            client.application.commands.set(client.arrayOfSlashCommands);
        }
        
    }
}