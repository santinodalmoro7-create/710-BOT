const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "stopped-soofer", // Nombre del comando
  description: "📦​ | Entrega Stopped Soofer", // Descripción
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Ingrese la/s key(s).",
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
    const key = interaction.options.getString("key");

    // Embed de entrega
    const embed = new Discord.EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/1321263618016284702/1346966717712175125/faixa_001.png?ex=698cfd02&is=698bab82&hm=742c7654140afade0e5893aa77be204822967084e833b698a104728ef80c4191&format=webp&quality=lossless&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Stopped Spoofer <:stopped:1376273781001158756>\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** [Haz Click Aqui](https://discord.com/channels/1469618754282586154/1470994997456408703)\n` +
        `**•  Tutorial:** ||https://youtu.be/isL0LLFKcDM||\n\n` +
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