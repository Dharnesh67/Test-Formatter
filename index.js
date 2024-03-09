import fs from 'fs';
fs.readFile('output.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file from disk: ${err}`);
    } else {
        console.log(`File contents: ${data}`);
    }
});
