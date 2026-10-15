import { cmd } from '../command.js';
import axios from 'axios';
import config from '../config.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const API_BASE_URL = '[https://aaqil-md.vercel.app/api](https://ahmad-md.vercel.app/api)';

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for bot",
    category: "owner",
    use: ".pair 923001234567",
    filename: __filename

}, async (conn, mek, m, {
    q,
    senderNumber,
    reply,
    react,
    from
}) => {

    try {
        const botName = config.BOT_NAME || "AAQIL MD";

        await react('⏳');

        const phoneNumber = q
            ? q.replace(/[^0-9]/g, '')
            : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber) {
            await react('❌');
            return await reply(
                "❌ Please provide a phone number\n\nExample:\n.pair 923001234567"
            );
        }

        if (phoneNumber.length < 10 || phoneNumber.length > 15) {
            await react('❌');
            return await reply("❌ Invalid phone number format");
        }

        let serversResponse;

        try {
            serversResponse = await axios.get(
                `${API_BASE_URL}/servers`,
                { timeout: 20000 }
            );
        } catch (e) {
            console.log("SERVER FETCH ERROR:", e.response?.data || e.message);
            await react('❌');
            return await reply("❌ Failed to connect to API server");
        }

        if (
            !serversResponse.data ||
            !Array.isArray(serversResponse.data.servers)
        ) {
            console.log("INVALID SERVER RESPONSE:", serversResponse.data);
            await react('❌');
            return await reply("❌ Invalid server response");
        }

        const servers = serversResponse.data.servers;

        if (servers.length === 0) {
            await react('❌');
            return await reply("❌ No active servers found");
        }

        const randomServer = servers[Math.floor(Math.random() * servers.length)];

        if (!randomServer.url) {
            await react('❌');
            return await reply("❌ Invalid server URL");
        }

        const serverUrl = randomServer.url.replace(/\/$/, '');

        let response;

        try {
            response = await axios.get(
                `${serverUrl}/code`,
                {
                    params: { number: phoneNumber },
                    timeout: 60000
                }
            );
        } catch (e) {
            console.log("PAIR API ERROR:", e.response?.data || e.message);
            await react('❌');
            return await reply(
                `❌ Pair API Failed\n\n${e.response?.data?.message || e.message}`
            );
        }

        const pairingCode =
            response.data?.code ||
            response.data?.pair ||
            response.data?.pairingCode;

        if (!pairingCode) {
            console.log("INVALID PAIR RESPONSE:", response.data);
            await react('❌');
            return await reply("❌ Pair code not found in API response");
        }

        await react('✅');

        // 1. INFO MESSAGE WITH NEWSLETTER CHANNEL
        const msg = `
✅ *${botName.toUpperCase()} PAIR CODE*

🌐 *Server:* ${randomServer.name || 'Active Server'}

📱 *How to connect:*
1. Open WhatsApp
2. Go to Linked Devices
3. Click "Link a Device"
4. Enter the code sent below

> *Powered by ${botName}*`;

        await conn.sendMessage(from, {
            text: msg.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363431150016962@newsletter',
                    newsletterName: botName,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // 2. PAIR CODE MESSAGE (FORMATTED FOR 1-TAP EASY COPY)
        await reply(`\`\`\`${pairingCode}\`\`\``);

    } catch (error) {
        const botName = config.BOT_NAME || "AAQIL MD";
        console.log("FULL ERROR:", error);
        await react('❌');
        return await reply(`❌ *Error:* ${error.message}\n\n*_Powered by${botName}_*`);
    }
});
            
