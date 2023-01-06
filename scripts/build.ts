import {join} from 'path';
import {createSymLink} from '@augment-vir/node-js';
import {cp, rename, rm, stat, unlink} from 'fs/promises';
import {awaitedForEach, getObjectTypedKeys} from '@augment-vir/common';
import {dirname} from 'path';
import {existsSync} from 'fs';

const suffix = '-temp-copy.txt';
const rootRepoDirPath = dirname(__dirname);

const publicFiles = {
    fontsDirPath: join(rootRepoDirPath, 'public', 'fonts'),
    fontsCssFilePath: join(rootRepoDirPath, 'public', 'fonts.css'),
};

const symLinks: Record<keyof typeof publicFiles, string> = {
    fontsDirPath: join(
        rootRepoDirPath,
        'node_modules',
        '@toniq-labs',
        'design-system',
        'public',
        'fonts',
    ),
    fontsCssFilePath: join(
        rootRepoDirPath,
        'node_modules',
        '@toniq-labs',
        'design-system',
        'public',
        'fonts.css',
    ),
};

const renamedFiles = [
    '.eslintignore',
    publicFiles.fontsCssFilePath,
    publicFiles.fontsDirPath,
];

async function preBuild() {
    await awaitedForEach(renamedFiles, async fileToRename => {
        await rename(fileToRename, `${fileToRename}${suffix}`);
    });

    await awaitedForEach(getObjectTypedKeys(publicFiles), async publicFileKey => {
        const publicFile = publicFiles[publicFileKey];
        const symLinkPath = symLinks[publicFileKey];
        const isDir = (await stat(symLinkPath)).isDirectory();

        await cp(symLinkPath, publicFile, isDir ? {recursive: true} : undefined);
    });
}

async function postInstall() {
    await awaitedForEach(getObjectTypedKeys(publicFiles), async publicFileKey => {
        const publicFile = publicFiles[publicFileKey];
        const symLinkPath = symLinks[publicFileKey];
        const isDir = (await stat(symLinkPath)).isDirectory();
        if (!existsSync(publicFile)) {
            await createSymLink(symLinkPath, publicFile, isDir);
        }
    });
}

async function postBuild() {
    await rm(publicFiles.fontsDirPath, {recursive: true, force: true});
    await unlink(publicFiles.fontsCssFilePath);

    await awaitedForEach(renamedFiles, async fileToRename => {
        await rename(`${fileToRename}${suffix}`, fileToRename);
    });
}

async function main() {
    const arg = process.argv[process.argv.length - 1];
    if (arg === 'post') {
        await postBuild();
    } else if (arg === 'pre') {
        await preBuild();
    } else if (arg === 'install') {
        await postInstall();
    } else {
        throw new Error(`Missing command input to build.js`);
    }
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
