const {CommandInteraction, Client, MessageEmbed} = require("discord.js");
const crypto = require("crypto");
const editJsonFile = require("edit-json-file");

module.exports = {
    name: "vote",
    description: "Casts a vote.",
    index: "Vote",
    options: [
        {
            name: "ballot",
            description: "Your ballot. Check /poll for instruction. NOBODY CAN FORCE YOU TO SHOW BALLOT, INCLUDING OFFICIALS!",
            type: "STRING",
            required: true
        }
    ],

    /**
    * @param {CommandInteraction} interaction
    * @param {Array<String>} args
    * @param {Client} client
    */
    execute(interaction, args, client){
        let file = editJsonFile("./data/data.json");
        let guild = client.guilds.cache.get(process.env.GUILD_ID);
        if(!guild) throw "Guild not found!";

        //check if poll is open
        if(!file.get("isOpen")){
            interaction.editReply(makeEmbed("Poll has been closed, you cannot vote!"));
            return;
        }

        //check if in DM
        if(interaction.channel.type !== "DM"){
            interaction.editReply(makeEmbed("You can only vote in this bot's DM!"));
            return;
        }
    
        //check if citizen
        if(!guild.members.cache.get(interaction.user.id)?.roles?.cache?.get(process.env.CITIZEN_ROLE_ID)){
            interaction.editReply(makeEmbed("You are not a citizen of the Bayer Free State, therefore you are not allowed to vote!"));
            console.log(`User <@!${interaction.user.id}> attempted to vote while not being a citizen.`);
            return;
        } 

        //create user's hash
        let userHash = crypto
        .createHash("sha512")
        .update(interaction.user.id)
        .digest("base64");

        //check if user has voted (compare user's has to file)
        if(file.get("voterHash").includes(userHash)){
            interaction.editReply(makeEmbed("You have already voted, therefore you are not allowed to vote!"));
            console.log(`User <@!${interaction.user.id}> attempted to vote while having already voted.`);
            return;
        }

        //enter ballot and shuffle ballot array
        file.set("ballots", shuffle([...file.get("ballots"), interaction.options.get("ballot").value]));

        //enter user hash and suffle voter hash array
        file.set("voterHash", shuffle([...file.get("voterHash"), userHash]));

        //save
        file.save();

        //tell the user that they have voted
        interaction.editReply(makeEmbed("Your ballot has successfully been cast!"));
    }
}

//make embed objects for plain text
function makeEmbed(text){
    return {
        embeds: [
            new MessageEmbed()
                .setColor(process.env.DEFAULT_COLOR)
                .setDescription(text)
        ]
    };
}

//shuffle arrays
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}