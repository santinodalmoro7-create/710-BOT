const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "discord", // Nombre del comando
  description: "📦​ | Entrega Discord", // Descripción
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
        content: "| No tienes permiso para usar este comando.", 
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1469970603178983507/1471086622601777152/descarga_1.png?ex=698da7ae&is=698c562e&hm=64d892a747eacfbb7e8a4de3027714b1d3d10b93dfa01ff0955dda9f83696fb6&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Discord Account\n\n` +
        `**•  Account(s):** ||${account}||\n` +
        `**•  Login:** [Haz Click Aqui](https://discord.com/login)\n\n` +
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