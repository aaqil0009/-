// ===============================
// BOT DP COMMAND - Using ImgBB
// ===============================
cmd({
    pattern: "botdp",
    alias: ["botimage", "botpic", "botphoto"],
    desc: "Set bot display picture",
    category: "settings",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator, args, updateUserConfig, userConfig, sanitizedNumber, quoted }) => {
    if (!isCreator) {
        return reply("*📛 ᴛʜɪs ɪs ᴀɴ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅ.*");
    }

    try {
        let imageUrl = args[0];

        // ImgBB API Keys list
        const IMGBB_API_KEYS = [
            'ebb2d6cad946fa45d7d9c4cc7dfa87e3',
            'b9b79efc2a2cf5380b57974bba4ce6d4',
            '9f47b49c2c1ea0bdb3f4acc4ebde2119',
            'a7c9712190de7a0d3c27e12ac5e4c3da',
            '55ec55ce1c92a23b47d958a1db63c486'
        ];

        // Function to get random API key
        function getRandomApiKey() {
            const randomIndex = Math.floor(Math.random() * IMGBB_API_KEYS.length);
            return IMGBB_API_KEYS[randomIndex];
        }

        // If no URL provided but replied to an image
        if (!imageUrl && m.quoted) {
            const quotedMsg = m.quoted;
            const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
            
            if (!mimeType || !mimeType.includes('image')) {
                return reply("❌ Please reply to an image");
            }

            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

            const mediaBuffer = await quotedMsg.download();

            // Get random API key
            const apiKey = getRandomApiKey();

            // Upload to ImgBB
            const form = new FormData();
            form.append('key', apiKey);
            form.append('image', mediaBuffer.toString('base64'));
            form.append('name', 'botdp');

            const response = await axios.post("https://api.imgbb.com/1/upload", form, {
                headers: form.getHeaders(),
                timeout: 60000
            });

            imageUrl = response.data?.data?.url;

            if (!imageUrl) throw new Error("Upload failed - no URL returned");

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        }

        // If URL provided directly
        if (!imageUrl || !imageUrl.startsWith("http")) {
            return reply("❌ Provide a valid image URL or reply to an image.");
        }

        // Update user config with new bot image
        userConfig.BOT_IMAGE = imageUrl;
        await updateUserConfig(sanitizedNumber, userConfig);

        // Send success message with the image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `✅ *Bot Display Picture Updated Successfully!*\n\n📁 *Image URL:* ${imageUrl}\n\n> © Updated by AAQIL MD🚩`
        }, { quoted: mek });

    } catch (error) {
        console.error('BotDP Error:', error);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        await reply(`❌ *Error:* ${error.message || error}\n\n*_ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴀQɪʟ ᴍᴅ_*`);
    }
});