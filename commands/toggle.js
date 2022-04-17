const {CommandInteraction, Client, MessageEmbed, MessageAttachment} = require("discord.js");
const editJsonFile = require("edit-json-file");
const fs = require("fs");

module.exports = {
    name: "toggle",
    description: "Opens or closes the poll",
    index: "Admin",
    options: [],
    
    /**
     * @param {CommandInteraction} interaction
     * @param {Array<String>} args
     * @param {Client} client
     */
    execute(interaction, args, client){
        let file = editJsonFile("./data/data.json");
        let guild = client.guilds.cache.get(process.env.GUILD_ID);
        if(!guild) throw "Guild not found!";
    
        if(interaction.channel.type === "DM"){
            interaction.followUp({content: "You cannot use this command in DM!"});
            return;
        }

        //seed
        if(!file.get("isOpen")){
            const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            let seed = "";

            for(let x = 0; x < 32; x++){
                seed += characters[Math.floor(Math.random() * characters.length)];
            }

            fs.writeFileSync("./data/seed.txt", seed, {encoding: "utf-8"});
            console.log("New seed generated.");
        }
        else{
            fs.writeFileSync("./data/seed.txt", "");
            console.log("Seed erased.");
        }
        
        file.set("isOpen", !file.get("isOpen"));
        file.save();
        console.log('Voting: ' + file.get("isOpen"));

        let embed = new MessageEmbed()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setAuthor({name: file.get("method")})
        .setDescription(`Poll is now ${file.get("isOpen") ? "open": "closed"}.`);
        
        interaction.editReply({
            embeds: [embed]
        });
    }
}