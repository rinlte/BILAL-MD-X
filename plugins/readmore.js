const { cmd } = require('../command');

cmd({
    pattern: 'readmore',
    alias: ['rm'],
    desc: 'Generate a ReadMore text (without showing "readmore" word)',
    category: 'tools',
    react: '📄',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Get full message text without command word
        const input = m.text?.replace(/^(\.readmore|\.rm)\s*/i, '').trim();
        if (!input) {
            return reply('📘 Example:\n.readmore Hello | This is hidden text');
        }

        const [visible, hidden] = input.split('|').map(x => x.trim());
        const more = String.fromCharCode(8206).repeat(4000); // invisible chars trigger readmore

        const output = visible
            ? `${visible}\n${more}\n${hidden || ''}`
            : `${more}\n${hidden || ''}`;

        await reply(output);
    } catch (err) {
        console.error('❌ Error in readmore:', err.message);
        reply('⚠️ Kuch ghalat ho gaya bhai, dubara try karo.');
    }
});
