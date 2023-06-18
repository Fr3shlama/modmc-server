const fs = require('fs');
const path = require('path');
const git = require('simple-git');
const archiver = require('archiver');
const config = require('../../config.json');


async function readVersionAndChangelog(modpack) {
    console.log(`Reading version and changelog for ${modpack.name}...`);

    const modpackDir = path.join(config.modpackStorageDir, modpack.name.replace(/ /g, '-'));
    const versionFilePath = path.join(modpackDir, 'version.json');

    if (fs.existsSync(versionFilePath)) {
        const versions = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
        const versionNumbers = Object.keys(versions).sort((a, b) => {
            const aParts = a.split('.').map(Number);
            const bParts = b.split('.').map(Number);
            
            for (let i = 0; i < aParts.length; i++) {
                if (aParts[i] > bParts[i]) return -1;
                if (aParts[i] < bParts[i]) return 1;
            }
            return 0;
        });
        
        const latestVersion = versionNumbers[0];

        modpack.version = latestVersion;
        modpack.changelog = versions[latestVersion];
    } else {
        console.warn(`No version.json found for modpack ${modpack.name}`);
    }
}

async function packageModpack(modpack) {
    console.log(`Packaging modpack ${modpack.name}...`);

    const modpackDir = path.join(config.modpackStorageDir, modpack.name.replace(/ /g, '-'));
    const output = fs.createWriteStream(path.join(config.publicDir, 'modpacks', `${modpack.name.replace(/ /g, '-')}.zip`));
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    archive.pipe(output);
    archive.directory(modpackDir, false);
    archive.finalize();

    console.log(`Successfully packaged modpack ${modpack.name}`);
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

async function processIcon(modpack, config) {
    console.log(`Processing icon for modpack ${modpack.name}...`);

    const modpackDir = path.join(config.modpackStorageDir, modpack.name.replace(/ /g, '-'));
    const iconPath = path.join(modpackDir, 'icon.png');
    const targetPath = path.join(config.publicDir, 'modpacks', `${modpack.name.replace(/ /g, '-')}.png`);
    try {
        if (fs.existsSync(iconPath)) {
            ensureDirectoryExistence(targetPath);
            fs.copyFileSync(iconPath, targetPath);
        } else {
            console.warn(`No icon found for modpack ${modpack.name}`);
        }
    } catch (err) {
        console.error(`Failed to copy icon for modpack ${modpack.name}: ${err}`);
    }
}

async function checkForUpdatesAndPackage(config) {
    for (let modpack of config.modpacks) {
        const modpackDir = path.join(config.modpackStorageDir, modpack.name.replace(/ /g, '-'));

        try {
            if (fs.existsSync(modpackDir)) {
                console.log(`Checking for updates for modpack ${modpack.name}...`);
                const gitRepo = git(modpackDir);
                await gitRepo.pull();
                console.log(`Successfully pulled updates for modpack ${modpack.name}`);
            } else {
                console.log(`Cloning repo for modpack ${modpack.name}...`);
                await git().clone(modpack.path, modpackDir);
                console.log(`Successfully cloned repo for modpack ${modpack.name}`);
            }
        } catch (err) {
            console.error(`Failed to pull or clone repo for modpack ${modpack.name}: ${err}`);
        }

        try {
            await readVersionAndChangelog(modpack);
        } catch (err) {
            console.error(`Failed to read version and changelog for modpack ${modpack.name}: ${err}`);
        }

        try {
            await processIcon(modpack, config);
        } catch (err) {
            console.error(`Failed to process icon for modpack ${modpack.name}: ${err}`);
        }

        try {
            await packageModpack(modpack);
        } catch (err) {
            console.error(`Failed to package modpack ${modpack.name}: ${err}`);
        }
    }
}
module.exports = {
    checkForUpdatesAndPackage
};
