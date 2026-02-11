const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "ipvanish", // Nombre del comando
  description: "📦​ | Entrega Ip Vanish", // Descripción
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "account",
      description: "Ingrese la/s account(s).",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    // Verificar si el usuario tiene el rol requerido
    const requiredRoleId = `${config.eventas}`;"1469967630365622403"
    const member = interaction.member;
    const hasRole = member.roles.cache.has(requiredRoleId);"1469967630365622403"

    if (!hasRole) {
      return interaction.reply({ 
        content: " | No tienes permiso para usar este comando.", 
        ephemeral: true 
      });
    }

    // Datos
    const bot = client.user.username;
    const avatar_bot = client.user.displayAvatarURL({ dynamic: true });
    const account = interaction.options.getString("account");

    // Embed de entrega
    const embed = new Discord.EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/1294464739006480385/1295097668946890813/ipvanish.png?ex=68b54372&is=68b3f1f2&hm=f630ab801492cdd6ccb17589d7ca0c1593055ec75f618ce2bf7db033418d5f6b&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Ip Vanish Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Login:** [Haz Click Aqui](https://www.ipvanish.com/)\n\n` +
        `Déjanos por favor una buena reseña para poder seguir creciendo! `
      );

    // 1. Enviar mensaje ephemeral al usuario
    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    // 2. Enviar embed públicamente al canal
    await interaction.channel.send({ embeds: [embed] });"https://discord.com/channels/1469618754282586154/1469619944676135033"
  }
}