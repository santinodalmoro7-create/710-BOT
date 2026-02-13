require('dotenv').config(); // <-- Esto permite leer tu archivo .env escondido
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

async function registerCommands() {
    // Intentamos obtener el TOKEN y el CLIENT_ID de donde sea que estén (ENV o Config)
    const token = process.env.TOKEN;
    const clientId = process.env.CLIENT_ID;

    if (!token || !clientId) {
        console.error("❌ ERROR: No se encontró el TOKEN o CLIENT_ID en las variables de entorno (.env o Railway).");
        return;
    }

    const commands = [];
    const commandsPath = path.resolve(__dirname, '..', 'Comandos');

    // Función para buscar archivos .js en carpetas y subcarpetas
    const getFilesRecursively = (dir) => {
        let files = [];
        if (!fs.existsSync(dir)) return files;
        const list = fs.readdirSync(dir);
        for (const item of list) {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                files = files.concat(getFilesRecursively(fullPath));
            } else if (item.endsWith('.js')) {
                files.push(fullPath);
            }
        }
        return files;
    };

    const commandFiles = getFilesRecursively(commandsPath);
    console.log(`🔍 Buscando comandos en: ${commandsPath}`);

    for (const filePath of commandFiles) {
        const command = require(filePath);
        if (command.data) {
            commands.push(command.data.toJSON());
            console.log(`✅ Comando detectado: ${path.basename(filePath)}`);
        }
    }

    if (commands.length === 0) {
        console.log("⚠️ No se detectaron comandos válidos para subir.");
        return;
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`🚀 Subiendo ${commands.length} comandos a Discord...`);
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log("✅ ¡PROCESO COMPLETADO CON ÉXITO!");
    } catch (error) {
        console.error("❌ ERROR AL REGISTRAR:", error);
    }
}

module.exports = registerCommands;