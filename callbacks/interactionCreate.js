import { Client, CommandInteraction, EmbedBuilder } from "discord.js";

export const name = "interactionCreate";
/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
export async function execute(interaction, client) {
    let guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) throw "Guild not found!";

    if (!interaction.isCommand()) return;
    await interaction.deferReply().catch(() => { });
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

    if (!guild.members.cache.get(interaction.user.id)?.roles?.cache?.get(process.env.EC_ROLE_ID) && cmd.index === "Admin") {
        interaction.followUp({ content: "You do not have permission to use this command!" });
        return;
    }

    try {
        cmd.execute(interaction, args, client);
    } catch (error) {
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
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