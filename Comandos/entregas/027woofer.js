const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "027woofer", // Coloque o nome do comando
  description: "📦​ | Entrega 027 Woofer", // Coloque a descrição do comando
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

                // ID del rol requerido
                const requiredRoleId = `${config.eventas}`;"1469967630365622403"

                // Verificar si el usuario tiene el rol
        const member = interaction.member;
        const hasRole = member.roles.cache.has(requiredRoleId);"1469967630365622403"
    
        if (!hasRole) {
          return interaction.reply({ content: "<:warninghost:1383935369275379874> | No tienes permiso para usar este comando.", ephemeral: true });
        }

    let bot = client.user.username;
    let avatar_bot = client.user.displayAvatarURL({ dynamic: true });
    let key = interaction.options.getString("key");

    let embed = new Discord.EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://media.discordapp.net/attachments/1359569148614541532/1382624268830900285/image.png?ex=698cd9f1&is=698b8871&hm=f9aa9b737d59b3fd23b7b9a3edc6d6f2701d6fd5e061962e6be3db350ca7a29f&format=webp&quality=lossless&width=837&height=514&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** 027 Woofer\n\n` +
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
    await interaction.channel.send({ embeds: [embed] });"https://discord.com/channels/1469618754282586154/1469619944676135033"
  }
}