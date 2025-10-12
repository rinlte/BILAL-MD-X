const { cmd } = require('../command');

cmd({
    pattern: 'readmore',
    alias: ['rm'],
    desc: 'Generate a custom ReadMore text preserving line spaces',
    category: 'tools',
    react: '📄',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Remove command name (.readmore or .rm)
        const input = m.text?.replace(/^(\.readmore|\.rm)\s*/i, '');
        if (!input || input.trim() === '') {
            return reply('📘 Example:\n.readmore Hello\n\n\n| Hidden text');
        }

        // Split into visible & hidden parts
        const [visible, hidden] = input.split('|');
        const more = String.fromCharCode(8206).repeat(4000); // triggers collapse

        // Preserve exact user-entered spacing (including newlines)
        const output = hidden
            ? `${visible || ''}${more}${hidden}`
            : `${more}${visible || ''}`;

        await reply(output);
    } catch (err) {
        console.error('❌ Error in readmore:', err.message);
        reply('⚠️ Kuch ghalat ho gaya bhai, dubara try karo.');
    }
});
