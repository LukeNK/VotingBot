const {CommandInteraction, Client, MessageEmbed, MessageAttachment} = require("discord.js");
const editJsonFile = require("edit-json-file");
const crypto = require("crypto")
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

            let publicHash = crypto
            .createHash("sha512")
            .update(seed)
            .digest("base64");
            
            fs.writeFileSync("./data/seed.txt", seed, {encoding: "utf-8"});
            fs.writeFileSync("./data/publicHash.txt", publicHash, {encoding: "utf-8"});

            console.log("New seed generated.");
            console.log('Seed hash: ' + publicHash);
            console.time('Voting period');
        }
        else{
            fs.rmSync('./data/seed.txt');
            console.log("Seed erased.");
            console.timeEnd('Voting period');
        }
        
        file.set("isOpen", !file.get("isOpen"));
        file.save();

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