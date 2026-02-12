const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compraconfirmada')
        .setDescription('Registra una venta en canal proof')
        .addStringOption(option => 
            option.setName('producto')
                .setDescription('Escribe el producto exacto (ej: gta v, nitro, etc.)')
                .setRequired(true))
        .addStringOption(option => option.setName('valor').setDescription('Monto pagado').setRequired(true))
        .addUserOption(option => option.setName('comprador').setDescription('Usuario que compró').setRequired(true)),

    async run(client, interaction) {
        
        // ==========================================
        // 🔑 CONTROL DE PERMISOS POR ROL
        // ==========================================
        const idRolPermitido = "1469968666425823274"; // <--- PEGA AQUÍ EL ID DEL ROL

        if (!interaction.member.roles.cache.has(idRolPermitido)) {
            return interaction.reply({ 
                content: "❌ No tienes los permisos de Staff necesarios para ejecutar este comando.", 
                ephemeral: true 
            });
        }
        // ==========================================

        const productoInput = interaction.options.getString('producto').toLowerCase();
        const valor = interaction.options.getString('valor');
        const comprador = interaction.options.getUser('comprador');

        // 🖼️ DICCIONARIO COMPLETO UNO POR UNO
        const imagenes = {
            'valorant': 'https://cdn.discordapp.com/attachments/1289423515199737929/1420549641895673987/Valorant-Logo-PNG-Image.png?ex=698e5f73&is=698d0df3&hm=5c5e6d8ae1d5d2a585cf8be4d771a9ebc702849f2a685381365a2a14762bcd26&',
            'counterstrike2': 'https://i.redd.it/d62aq07xnbpa1.png',
            'rockstargames': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471536977777000560/file_00000000f1c4720e982e88f342a81844.png?ex=698f4b1b&is=698df99b&hm=d3642a9c6794ab603c424644cf56500772aeea132f2be35acb5812493a744577&',
            'steam': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471536956612673606/file_00000000f390720e91c2fe9b6efb165b.png?ex=698f4b16&is=698df996&hm=1b2b70b3a84168f3ec423f14b9fcbf221bfe8cf18bd3359aa214f3c8a59e844f&',
            'discord': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471537060140683264/file_00000000033c71f5b9a945c94d48030e.png?ex=698f4b2e&is=698df9ae&hm=a1259d62cadd400ee2cd6b67f7e3d35c94f3b652483dc7222b6fb6a7ba169ce7&',
            'nordvpn': 'https://cdn.discordapp.com/attachments/1320881008823763047/1419855065883349043/NordVPN-Logo.png?ex=698e7b93&is=698d2a13&hm=a448db92b64236353da5b7e1fe281d5ba53f2363f17ff9da95150cb821500254&',
            'ipvanish': 'https://i.pcmag.com/imagery/reviews/03fHQY9HD9MenUVqaTWcrGs-41.fit_scale.size_1028x578.v1712846686.png',
            'tunnelbear': 'https://cdn.discordapp.com/attachments/1397090281794306082/1431039766408986855/tunnelbear-vpn_rrt9.jpg?ex=698ef663&is=698da4e3&hm=16012c366821b204f5b4ca8b15ee958684cedf67e45797e7c12930e241cfe71a&',
            'discord old': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471537060140683264/file_00000000033c71f5b9a945c94d48030e.png?ex=698f4b2e&is=698df9ae&hm=a1259d62cadd400ee2cd6b67f7e3d35c94f3b652483dc7222b6fb6a7ba169ce7&',
            'discord nitrada': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471537060140683264/file_00000000033c71f5b9a945c94d48030e.png?ex=698f4b2e&is=698df9ae&hm=a1259d62cadd400ee2cd6b67f7e3d35c94f3b652483dc7222b6fb6a7ba169ce7&',
            'minecraft java y bedrock': 'https://cdn.discordapp.com/attachments/1470928427199631412/1471463804293353646/file_000000009ac871f58dc62e3d6da52017.png?ex=698f06f5&is=698db575&hm=b0fae79c7324120179b75f0437e4ba5ebc035ae088145531ba333ba846ab8aa5&',
            'combos': 'https://cdn.discordapp.com/attachments/1462008368616177675/1471300797697622126/file_00000000aae871f5bd8699d9d927a520.png?ex=698e6f25&is=698d1da5&hm=a8b190302f89a153ca5aa088fc3d013823b32c5aee45d7bcd6eab42745861a26&',
            'chatp gpt acces': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471539274594910470/descarga_3.png?ex=698f4d3e&is=698dfbbe&hm=a49fd50e84297e7a80abdaf5a664d1dd893ffed42d575df36781cd61a66a1b72&',
            'telegram phones': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&',
            'panel de seguidores': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&',
            'dni arg': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&',
            'informes': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&',
            'juegos offline': 'https://cdn.discordapp.com/attachments/1470928427199631412/1471461456498397360/file_000000001720720ebc6bb019cbd557ef.png?ex=698f04c5&is=698db345&hm=1b39acbbc1e690e63f9b4127438b5b936272bfdaee9ba12c3b03a1456804842c&',
            'gta v': 'https://mundosteam.shop/wp-content/uploads/2025/01/Diseno-sin-titulo7.png',
            'rust': 'https://cdn.discordapp.com/attachments/1470719436578226176/1470722980920295590/descarga_3.jpeg?ex=698ef803&is=698da683&hm=e3a227e6b7fad1931c69738a24fa29942885fcc5696b4eda4d8f0bacd4e3c776&',
            'rust no full acces': 'https://cdn.discordapp.com/attachments/1470719436578226176/1470722980920295590/descarga_3.jpeg?ex=698ef803&is=698da683&hm=e3a227e6b7fad1931c69738a24fa29942885fcc5696b4eda4d8f0bacd4e3c776&',
            'fifa 23': 'https://mundosteam.shop/wp-content/uploads/2023/12/fifa23mundial1-0a38a9d2353e5fbec616803192697561-640-0.webp',
            'fifa 24': 'https://mundosteam.shop/wp-content/uploads/2024/04/Fc24-scaled.jpg',
            'fifa 25': 'https://mundosteam.shop/wp-content/uploads/2024/09/Fc25online-scaled.jpg',
            'fifa 26': 'https://mundosteam.shop/wp-content/uploads/2025/07/Fc26online.jpg',
            'hitman': 'https://mundosteam.shop/wp-content/uploads/2023/12/Diseno-sin-titulo-79.png',
            'internet cafe simulator': 'https://mundosteam.shop/wp-content/uploads/2024/01/Diseno-sin-titulo-3.png',
            'repo': 'https://mundosteam.shop/wp-content/uploads/2025/06/Diseno-sin-titulo33.png',
            'batman arkham collection': 'https://mundosteam.shop/wp-content/uploads/2024/01/Diseno-sin-titulo-16.png',
            'dying light 1': 'https://mundosteam.shop/wp-content/uploads/2024/03/Diseno-sin-titulo-80.png',
            'dying light 2': 'https://mundosteam.shop/wp-content/uploads/2023/12/Diseno-sin-titulo-2023-11-06T233402.403.png',
            'spiderman': 'https://mundosteam.shop/wp-content/uploads/2023/12/Combs27.jpg',
            'tony hawks pro skater': 'https://mundosteam.shop/wp-content/uploads/2025/06/Diseno-sin-titulo17.png',
            'schelude': 'https://mundosteam.shop/wp-content/uploads/2025/03/Sch1-scaled.jpg',
            'dark souls': 'https://mundosteam.shop/wp-content/uploads/2024/08/Psds-scaled.jpg',
            'blunde': 'https://mundosteam.shop/wp-content/uploads/2024/08/Psds-scaled.jpg',
            'lego starwars': 'https://cdn.discordapp.com/attachments/1470721123267379373/1470726956264984576/image.png?ex=698efbb7&is=698daa37&hm=fb145536319ff272eab4fb7f080c116f27d79c1416a6d994d8fd1458b6cf551b&',
            'the last of us': 'https://cdn.discordapp.com/attachments/1470928427199631412/1471537891045015778/descarga_5.jpeg?ex=698f4bf5&is=698dfa75&hm=4356c47f4c5d80f326e4320e5f8470619135312d8b1bd61b3f5f7e37a47cfb51&',
            'f125': 'https://mundosteam.shop/wp-content/uploads/2025/05/Diseno-sin-titulo7.png',
            'stopped ext': 'https://cdn.discordapp.com/attachments/1366208295135612943/1366209894675644436/1.png?ex=698e709d&is=698d1f1d&hm=8cfee489c2008ae366b80ede9f77d4542e87eb35c06b27ef043a4a5520e65fa9&',
            'stopped int': 'https://cdn.discordapp.com/attachments/1055218979964199022/1383922529260933190/1SfGjlUmqyY_1280x720.jpg?ex=698ef00b&is=698d9e8b&hm=f2b20dff7c6fd4acb9c79f0973fd8c7e9dd29c6e2b8ac3c4e0646215eb0f2fbc&',
            'stopped spoofer': 'https://media.discordapp.net/attachments/1321263618016284702/1346966717712175125/faixa_001.png?ex=698ef742&is=698da5c2&hm=cbfb7adce2929b53e4f0569b5c363ab2e2fbf26fc233df7c5932bdfaad9db1e6&format=webp&quality=lossless&',
            'spoofer all games': 'https://cdn.discordapp.com/attachments/1277611473589239912/1377645342903762944/spoofer_hwid_permanente.png?ex=698e8375&is=698d31f5&hm=7c09d2e67affd5f2dbef27e3b2e299231bd2e086d46e371d68f949cd84ad191f&',
            'spoofer fort temp': 'https://cdn.discordapp.com/attachments/1359569148614541532/1383738720926306304/F7R0VoR.png?ex=698eed9b&is=698d9c1b&hm=4364699c96b0071f74c822500b770521730f08a11656ab72a15d02b36a6ae278&',
            '027 fivem': 'https://media.discordapp.net/attachments/1359569148614541532/1382624268830900285/image.png?ex=698ed431&is=698d82b1&hm=4f62b3632cd755297236d35d3fef6495312d37d5d757f4666b4b62c6b66c3489&format=webp&quality=lossless&width=837&height=514&',
            'gosth': 'https://cdn.discordapp.com/attachments/1294464739006480385/1294758501817516094/gosth.png?ex=698ee092&is=698d8f12&hm=722d0c08933ba908605302f8539d9835f6c85eaa555d0fb46816fcb887fcb289&',
            'nexhub woofer': 'https://cdn.discordapp.com/attachments/1254106215601144000/1266942378120577115/public_1.gif?ex=698f3249&is=698de0c9&hm=3b00f0fe376c0a2feac8f360e818673ef9ce29ed90344cc966cb566b62151a2e&',
            'nexhub external pvp': 'https://cdn.discordapp.com/attachments/1254106215601144000/1266942378120577115/public_1.gif?ex=698f3249&is=698de0c9&hm=3b00f0fe376c0a2feac8f360e818673ef9ce29ed90344cc966cb566b62151a2e&',
            'nixware': 'https://media.discordapp.net/attachments/1294464739006480385/1336544441317724281/rage-1.png?ex=698f4842&is=698df6c2&hm=621ea24e433df0644d6588aeaf51c4e35163c3edafa019bca9b6ad3203474052&format=webp&quality=lossless&',
            'predator': 'https://cdn.discordapp.com/attachments/1469989717595652188/1470692503979167744/image.png?ex=698edba1&is=698d8a21&hm=45e985942ae5f82b2385d07749d61aa299585689fde3e2fd8e9ae817f74cb820&',
            'nitro link': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471537060140683264/file_00000000033c71f5b9a945c94d48030e.png?ex=698f4b2e&is=698df9ae&hm=a1259d62cadd400ee2cd6b67f7e3d35c94f3b652483dc7222b6fb6a7ba169ce7&',
            'nitro': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471537060140683264/file_00000000033c71f5b9a945c94d48030e.png?ex=698f4b2e&is=698df9ae&hm=a1259d62cadd400ee2cd6b67f7e3d35c94f3b652483dc7222b6fb6a7ba169ce7&',
            'server boost': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471537060140683264/file_00000000033c71f5b9a945c94d48030e.png?ex=698f4b2e&is=698df9ae&hm=a1259d62cadd400ee2cd6b67f7e3d35c94f3b652483dc7222b6fb6a7ba169ce7&',
            'discord members': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&',
            'decorations': 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&'
        };

        // Si el producto no está en la lista, usa la imagen por defecto
        const imagenFinal = imagenes[productoInput] || 'https://cdn.discordapp.com/attachments/1471520378563068035/1471534083128561808/file_00000000252c720eb05b361937b63017.png?ex=698f4869&is=698df6e9&hm=2c10f3f7481deed565eed03b7cabf503c8efe9b89085e040869e610a87df8a8e&';

        const canalLogs = interaction.guild.channels.cache.get("1469619944676135033");

        const embed = new EmbedBuilder()
            .setTitle('710 | Shop | Compra Aprobada')
            .setColor(config.colorpredeterminado || 0x000000)
            .setDescription(
                `👤 | **COMPRADOR(A):**\n<@${comprador.id}> | ${comprador.username}\n\n` +
                `📜 | **PRODUCTO(S) COMPRADO(S):**\n${productoInput.toUpperCase()}\n\n` +
                `💸 | **VALOR PAGADO:**\nARS$${valor}\n\n` +
                `💳 | **MÉTODO DE PAGO:**\nMercado Pago\n\n` +
                `📅 | **FECHA Y HORA:**\n<t:${Math.floor(Date.now() / 1000)}:f>\n\n` +
                `⭐ | **EVALUACIÓN:**\nSin Evaluación.`
            )
            .setImage(imagenFinal)
            .setFooter({ text: 'Saytus | Shop - Todos los derechos reservados.' });

        if (canalLogs) {
            await canalLogs.send({ embeds: [embed] });
            return interaction.reply({ content: `✅ Venta de **${productoInput}** registrada con éxito.`, ephemeral: true });
        } else {
            return interaction.reply({ content: '❌ Error: No se encontró el canal de logs.', ephemeral: true });
        }
    }
};