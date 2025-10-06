const { cmd } = require('../command');

cmd({
    pattern: 'readmore',
    alias: ['rm'],
    desc: 'Generate a ReadMore text',
    category: 'tools',
    react: '📄',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const input = m.text?.split(' ').slice(1).join(' ');
        if (!input) {
            return reply('📘 Example:\n.readmore Hello | This is hidden text');
        }

        const [visible, hidden] = input.split('|').map(x => x.trim());
        const more = String.fromCharCode(8206).repeat(4000); // invisible space chars

        const output = visible
            ? `${visible}\n${more}\n${hidden || ''}`
            : `${more}\n${hidden || ''}`;

        await reply(output);
    } catch (err) {
        console.error('❌ Error in readmore:', err.message);
        reply('⚠️ Kuch ghalat ho gaya bhai, dubara try karo.');
    }
});
