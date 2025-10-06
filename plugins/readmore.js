const { cmd } = require('../command');

cmd({
    pattern: 'readmore',
    desc: 'Generate a readmore text',
    use: '.readmore line1 | line2'
}, async (message, match) => {
    try {
        if (!match) {
            return await message.reply('📄 Example:\n.readmore Hello | This is hidden text');
        }

        // Split visible aur hidden text
        const [visible, hidden] = match.split('|').map(x => x.trim());

        const more = String.fromCharCode(8206).repeat(4000); // invisible chars

        const output = visible
            ? `${visible}\n${more}\n${hidden || ''}`
            : `${more}\n${hidden || ''}`;

        await message.reply(output);
    } catch (err) {
        console.error('❌ Error in readmore cmd:', err.message);
        await message.reply('⚠️ Kuch ghalat ho gaya bhai.');
    }
});
