import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd, commands } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// --- PING COMMAND ---
cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTER ---
        try {
            await conn.newsletterUnfollow('120363428270479513@newsletter');
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const start = new Date().getTime();

        const reactionEmojis = ['⚡', '🚀', '🎯', '✨', '💎'];
        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        const botName = config.BOT_NAME || "AAQIL MD";

        const text = `⚡ *${botName.toUpperCase()} SPEED*\n\n🚀 *Response Speed:* \`${responseTime.toFixed(2)}s\``;

        await conn.sendMessage(from, {
            text: text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363431150016962@newsletter',
                    newsletterName: botName,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        const botName = config.BOT_NAME || "AAQIL MD";
        console.error("Error in ping command:", e);
        reply(`⚠️ *Error:* ${e.message}\n\n*_Powered by${botName}_*`);
    }
});

// --- PING2 COMMAND ---
cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTER ---
        try {
            await conn.newsletterUnfollow('120363428270479513@newsletter');
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 500));
        const endTime = Date.now();
        const ping = endTime - startTime;
        const botName = config.BOT_NAME || "AAQIL MD";

        const msg = `🎯 *${botName.toUpperCase()} LATENCY*\n\n📡 *Ping Speed:* \`${ping} ms\``;

        await conn.sendMessage(from, { 
            text: msg,
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

    } catch (e) {
        const botName = config.BOT_NAME || "AAQIL MD";
        console.log(e);
        reply(`⚠️ *Error:* ${e.message}\n\n*_Powered by ${botName}_*`);
    }
});
            
