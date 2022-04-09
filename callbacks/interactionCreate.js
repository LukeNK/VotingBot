const {
    Interaction,
    Client,
    MessageEmbed
} = require("discord.js");
module.exports = {
    name: "interactionCreate",

    /**
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        await interaction.deferReply().catch(() => {});
        let cmd = client.commands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({
            "content": "Could not find command!"
        });
        const args = [];
        interaction.options.data.map(v => args.push(v.value));
        
        if (cmd.index === "Disabled")
            return interaction.followUp({
                content: "This command is currently disabled."
            });
        
        if (
            cmd.index === "Admin" &&
            !interaction.member?.permissions.has("ADMINISTRATOR", {
                checkAdmin: true,
                checkOwner: false,
            })
        )
            return interaction.followUp({
                content: "You don't have permissions."
            });
        
        try {
            cmd.execute(interaction, args, client);
        } catch (error) {
            interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("This command has failed to execute due to an error.")
                    .addField('Error', `\`\`\`\n${error.toString().slice(0, 1000)}\n\`\`\``)
                    .setFooter("Please contact the Election Commission for help.")
                    .setColor(0xf0160b)
                ]
            });
            console.log(error);
        }
    }
}