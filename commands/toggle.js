const {CommandInteraction, Client, MessageEmbed, MessageAttachment} = require("discord.js");
const editJsonFile = require("edit-json-file");
let file = editJsonFile("./data/data.json");

module.exports = {
    name: "Toggle",
    description: "Opens or closes the poll",
    index: "Admin",
    options: [],

    /**
    * @param {CommandInteraction} interaction
    * @param {Array<String>} args
    * @param {Client} client
    */
    execute(interaction, args, client){
        let guild = client.guilds.cache.get(process.env.GUILD_ID);
        if(!guild) throw "Guild not found!";
    
        if(interaction.channel.type === "DM"){
            interaction.followUp({content: "You cannot use this command in DM!"});
            return;
        }

        if(file.get("isOpen")){
            interaction.followUp({content: "You cannot reveal the results when the poll has not been closed!"});
            return;
        }
        
        file.set("isOpen", !file.get("isOpen"));
        file.save();

        let embed = new MessageEmbed()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setAuthor({name: file.get("method")})
        .setDescription(`Poll is now ${file.get("isOpen") ? "open": "closed"}`);
        
        interaction.editReply({
            embeds: [embed]
        });
    }
}