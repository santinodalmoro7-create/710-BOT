const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
  name: "bigmenu", // Nombre del comando
  description: "📦​ | Entrega Big Menu", // Descripción
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
      .setThumbnail("https://cdn.discordapp.com/attachments/1318607225857638431/1321895258006618233/logo-bigpng.png?ex=68e0b325&is=68df61a5&hm=0329eb703540acdea5b3f9db907ba00bd1bd15b469dbf982510dfc5982f6d570&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Big Menu\n\n` +
        `**•  Key(s):** ||${key}||\n` +
        `**•  Download:** ||||\n\n` +
        `Déjanos por favor una buena reseña para poder seguir creciendo! `
      );

    // 1. Enviar mensaje ephemeral al usuario
    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    // 2. Enviar embed públicamente al canal
    await interaction.channel.send({ embeds: [embed] });"1469619944676135033"
  }
}