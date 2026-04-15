const fs = require('fs');
const path = require('path');

function walk(dir, call) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath, call);
        } else {
            call(fullPath);
        }
    }
}

const replacements = [
    { from: /\bbg-navy-900\b/g, to: 'bg-slate-50' },
    { from: /\bbg-navy-800\b/g, to: 'bg-white' },
    { from: /\bborder-navy-700\b/g, to: 'border-slate-200' },
    { from: /\bborder-navy-600\b/g, to: 'border-slate-300' },
    { from: /\btext-gray-300\b/g, to: 'text-slate-600' },
    { from: /\btext-gray-400\b/g, to: 'text-slate-500' },
    { from: /\btext-white\b/g, to: 'text-slate-800' } // Dangerous for buttons, but ok for general text.
    // wait, we can't blindly replace text-white everywhere. We need exception for buttons.
];

function processFile(filePath) {
    if (!filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Custom logic to avoid messing up buttons but replace other text-white
    content = content.replace(/text-white/g, (match, offset, str) => {
        // If it's near to 'btn-primary' or 'text-white' is within a <button, leave it or change it?
        // Actually, we are going to define text-white in CSS for .btn-* so it's fine if we replace it in JSX, 
        // wait, if we replace text-white with text-slate-800, the button gets inline text-slate-800! That wins over CSS.
        // So let's look for buttons.
        const chunkContext = str.substring(Math.max(0, offset - 30), offset);
        if (chunkContext.includes('btn-primary') || chunkContext.includes('text-white') || chunkContext.includes('bg-')) {
            // let's do a more robust approach:
        }
        return 'text-slate-800'; // Default
    });

    // Actually, simpler: I'll use multi_replace for Login/Signup explicitly and then apply general script?
    // Let's just do a string replace, and fix Login/Signup manually after.
}

walk(path.join(__dirname, 'src'), (filePath) => {
    if (!filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace text-white ONLY if it's not inside a className that also has btn-primary, bg-gradient...
    // simpler: just replace everything, and I'll use replace_file_content to fix Navbar/Login buttons.
    
    content = content.replace(/\bbg-navy-900\b/g, 'bg-slate-50');
    content = content.replace(/\bbg-navy-800\b/g, 'bg-white');
    content = content.replace(/\bborder-navy-700\b/g, 'border-slate-200');
    content = content.replace(/\bborder-navy-600\b/g, 'border-slate-300');
    content = content.replace(/\btext-gray-300\b(\/?20)?/g, 'text-slate-600');
    content = content.replace(/\btext-gray-400\b(\/?20)?/g, 'text-slate-500');
    
    // Replace text-white except in a few known button classes from Login and Signup.
    // For safety, let's just replace `text-white` with `text-slate-800` globally and then I'll fix the UI manually.
    content = content.replace(/\btext-white\b/g, 'text-slate-800');

    // Make glass-card slightly more opaque
    content = content.replace(/bg-opacity-60/g, 'shadow-sm border');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
});
