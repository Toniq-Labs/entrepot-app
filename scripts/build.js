const fs = require('fs');
const join = require('path').join;

const suffix = '-temp-copy.txt';

const renamedFiles = ['.eslintignore', join('public', 'fonts'), join('public', 'fonts.css')];

function preBuild() {
    renamedFiles.forEach(fileToRename => {
        fs.renameSync(fileToRename, `${fileToRename}${suffix}`);
    });
    fs.cpSync(
        join('node_modules', '@toniq-labs', 'design-system', 'public', 'fonts'),
        join('public', 'fonts'),
        {recursive: true},
    );
    fs.cpSync(
        join('node_modules', '@toniq-labs', 'design-system', 'public', 'fonts.css'),
        join('public', 'fonts.css'),
    );
}

function postBuild() {
    fs.rmSync(join('public', 'fonts'), {recursive: true, force: true});
    fs.unlinkSync(join('public', 'fonts.css'));

    renamedFiles.forEach(fileToRename => {
        fs.renameSync(`${fileToRename}${suffix}`, fileToRename);
    });
}

function main() {
    const arg = process.argv[process.argv.length - 1];
    if (arg === 'post') {
        postBuild();
    } else if (arg === 'pre') {
        preBuild();
    } else {
        throw new Error(`Missing command input to build.js`);
    }
}

main();
