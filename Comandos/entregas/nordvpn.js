const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "nordvpn", // Nombre del comando
  description: "📦​ | Entrega Nord Vpn", // Descripción
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
        content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.", 
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
      .setThumbnail("https://pbs.twimg.com/profile_images/1618629073969750018/_J6Qi3VW_400x400.jpg")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Nord Vpn Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Login:** [Haz Click Aqui](https://nordaccount.com/login/identifier?challenge=4%7C1b5cef88c92b4cdba74b9e18cc38ab25)\n\n` +
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