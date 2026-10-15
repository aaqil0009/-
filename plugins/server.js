import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);

// API BASE URL (Pair command ki tarah)
const API_BASE_URL = 'https://aaqil-md.vercel.app/api';
const Key = 'AHMAD-MD';

// Helper: Status emoji based on count
function getCountStatus(count) {
    if (count === 50) return '🔴';
    if (count >= 40) return '🟣';
    if (count >= 30) return '🟡';
    if (count >= 20) return '🟠';
    if (count >= 10) return '🔵';
    return '🟢';
}

// Helper: Validate channel post URL
function isValidChannelPostUrl(url) {
    const pattern = /^https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+\/\d+$/;
    return pattern.test(url);
}

// Helper: Extract channel ID and post ID
function extractIdsFromUrl(url) {
    const match = url.match(/\/channel\/([a-zA-Z0-9]+)\/(\d+)/);
    if (match) {
        return { channelId: match[1], postId: match[2] };
    }
    return null;
}

// Helper: Parse emojis
function parseEmojis(input) {
    let emojis = [];
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    for (const part of parts) {
        const emojiRegex = /[\p{Emoji}\u200d]/u;
        if (emojiRegex.test(part)) emojis.push(part);
    }
    return emojis;
}

// Helper: Validate emojis
function validateEmojis(emojis) {
    if (!emojis || emojis.length === 0) {
        return {
            valid: false,
            error: '❌ *No valid emojis found!*\n*Example:* .chreact https://whatsapp.com/channel/ID/123 😂,❤️,🔥'
        };
    }
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]{2,}/u;
    if (emojis.some(e => consecutiveEmojisRegex.test(e))) {
        return {
            valid: false,
            error: '❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .chreact link 😂,❤️,🔥'
        };
    }
    return { valid: true, emojis };
}

// ==================== CHREACT COMMAND ====================
cmd({
    pattern: "chreact",
    alias: ["channelreact", "react", "rp"],
    react: "🎯",
    desc: "React to WhatsApp channel post",
    category: "group",
    use: ".chreact <channel_post_url> [emojis]",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const botName = config.BOT_NAME || "AAQIL MD";

        if (!args[0]) {
            return reply(`❌ *Please provide a channel post URL!*\n\n*Example:*\n.chreact https://whatsapp.com/channel/0029VbD059NBadmT79uGx41n/609\n\n*With emojis:*\n.chreact https://whatsapp.com/channel/0029VbD059NBadmT79uGx41n/609 ❤️,🫠,🥰`);
        }
        
        const url = args[0];
        
        if (!isValidChannelPostUrl(url)) {
            return reply(`❌ *Invalid URL format!*\n\n*Valid format:*\nhttps://whatsapp.com/channel/CHANNEL_ID/POST_ID`);
        }
        
        const ids = extractIdsFromUrl(url);
        if (!ids) {
            return reply(`❌ *Failed to extract channel/post IDs from URL!*`);
        }
        
        let emojis = [];
        let emojisString = '';
        
        if (args.length > 1) {
            const remaining = args.slice(1).join(' ');
            emojis = parseEmojis(remaining);
            emojisString = emojis.join(',');
        }
        
        if (!emojisString) {
            emojis = ['❤️', '🫠', '👻'];
            emojisString = emojis.join(',');
        }
        
        const validation = validateEmojis(emojis);
        if (!validation.valid) {
            return reply(validation.error);
        }
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        // Fetch servers from API (Pair Command Link)
        const serversResponse = await axios.get(`${API_BASE_URL}/servers`, { timeout: 10000 });
        
        if (!serversResponse.data || !serversResponse.data.servers) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch server list!*");
        }
        
        const servers = serversResponse.data.servers;
        
        if (servers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *No servers found!*");
        }
        
        const resultMessage = `
🎯 *${botName.toUpperCase()} REACTION SENT*

📌 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
😊 *Emojis:* ${validation.emojis.join(' ')}
🌐 *Servers:* ${servers.length}

> *Powered by ${botName}*`;

        await conn.sendMessage(from, {
            text: resultMessage.trim(),
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

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        
        // Send reaction requests to all active servers
        for (const server of servers) {
            const externalServerUrl = server.url.replace(/\/$/, '');
            const reactUrl = `${externalServerUrl}/react?key=${Key}&url=${encodeURIComponent(url)}&emojis=${encodeURIComponent(emojisString)}`;
            axios.get(reactUrl, { timeout: 5000 }).catch(() => {});
        }
        
    } catch (error) {
        const botName = config.BOT_NAME || "AAQIL MD";
        console.error("React post error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error:* ${error.message}\n\n*_Powered by ${botName}_*`);
    }
});

// ==================== STATUS COMMAND ====================
cmd({
    pattern: "status",
    alias: ["serverstatus", "stats", "servers"],
    react: "📊",
    desc: "Check server status and active users",
    category: "owner",
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { from, reply, react }) => {
    try {
        const botName = config.BOT_NAME || "AAQIL MD";
        await react('⏳');

        // Fetch servers from API
        const serversResponse = await axios.get(`${API_BASE_URL}/servers`, { timeout: 10000 });
        
        if (!serversResponse.data || !serversResponse.data.servers) {
            await react('❌');
            return reply("❌ Failed to fetch server list.");
        }

        const servers = serversResponse.data.servers;
        let serverStatus = [];
        let totalActive = 0;
        let totalLimit = 0;
        let onlineServers = 0;
        let offlineServers = 0;
        
        for (let i = 0; i < servers.length; i++) {
            const server = servers[i];
            const serverUrl = server.url.replace(/\/$/, '');
            
            try {
                const statusResponse = await axios.get(`${serverUrl}/active`, { timeout: 8000 });
                
                if (statusResponse.data && !statusResponse.data.error) {
                    const count = statusResponse.data.count || 0;
                    const limit = statusResponse.data.limit || 50;
                    const statusEmoji = getCountStatus(count);
                    
                    serverStatus.push({
                        name: server.name || `Server ${i + 1}`,
                        count: count,
                        limit: limit,
                        status: `${statusEmoji} ONLINE`
                    });
                    
                    totalActive += count;
                    totalLimit += limit;
                    onlineServers++;
                } else {
                    serverStatus.push({
                        name: server.name || `Server ${i + 1}`,
                        count: 0,
                        limit: 50,
                        status: '🟡 NO DATA'
                    });
                    offlineServers++;
                }
            } catch (error) {
                serverStatus.push({
                    name: server.name || `Server ${i + 1}`,
                    count: 0,
                    limit: 50,
                    status: '🔴 OFFLINE'
                });
                offlineServers++;
            }
        }

        await react('✅');

        let statusMessage = `📊 *${botName.toUpperCase()} SERVER STATUS*\n\n`;
        statusMessage += `🌐 *Total Servers:* ${servers.length}\n`;
        statusMessage += `🟢 *Online:* ${onlineServers} | 🔴 *Offline:* ${offlineServers}\n`;
        statusMessage += `⚡ *Active Load:* ${totalActive}/${totalLimit}\n\n`;
        statusMessage += `──────── SERVER LIST ────────\n`;

        serverStatus.forEach((s) => {
            statusMessage += `• ${s.name}: ${s.count}/${s.limit} (${s.status})\n`;
        });

        statusMessage += `\n> *Powered by ${botName}*`;

        await conn.sendMessage(from, {
            text: statusMessage.trim(),
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

    } catch (error) {
        const botName = config.BOT_NAME || "AAQIL MD";
        console.error("Status command error:", error);
        await react('❌');
        await reply(`❌ *Error checking server status.*\n\n*_Powered by ${botName}_*`);
    }
});
            
