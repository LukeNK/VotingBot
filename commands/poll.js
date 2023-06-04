const {CommandInteraction, Client, MessageEmbed} = require("discord.js");
const editJsonFile = require("edit-json-file");

module.exports = {
    name: "poll",
    description: "Shows the poll.",
    index: "Vote",
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

        let embed = new MessageEmbed()
        .setColor(guild.me.displayHexColor || process.env.DEFAULT_COLOR)
        .setTitle(file.get("title"))
        .setDescription(file.get("description"))
        .setImage(file.get("image"))
        .setAuthor({name: file.get("method")})
        .setFooter({text: file.get("footer")})
        .addField("\u200b", "**OPTIONS**")

        let options = file.get("options");
        options.forEach(v => embed.addField(`${v.name?.toUpperCase()} \`/vote ${v.name?.toUpperCase()}`, v.description));

        interaction.editReply({embeds: [embed]});
    }
}