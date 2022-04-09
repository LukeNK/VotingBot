const {CommandInteraction, Client, MessageEmbed, MessageAttachment} = require("discord.js");
const editJsonFile = require("edit-json-file");

module.exports = {
    name: "results",
    description: "Sends ballots and the data file.",
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

        if(file.get("isOpen")){
            interaction.followUp({content: "You cannot reveal the results when the poll has not been closed!"});
            return;
        }

        let ballots = `Ballots of "${file.get("title")}"\n-------------\n\n\n`;

        file.get("ballots").forEach(v=>ballots+=`${v}\n\n`);

        ballots += `In total: ${file.get("ballots").length} ballots cast.`

        let embed = new MessageEmbed()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setAuthor({name: file.get("method")})
        .setDescription("A text file containing all ballots and a JSON file containing the raw data.")
        
        interaction.editReply({
            embeds: [embed],
            files: [
                new MessageAttachment(Buffer.from(ballots), "ballots.txt"),
                "./data/data.json"
            ]
        })
    }
}