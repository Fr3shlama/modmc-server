const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const path = require('path');
const fs = require('fs');


console.log('packListRouter.js module loaded.');

router.get('/', (req, res) => {
    console.log('Processing GET request on packListRouter.');

    const modpacks = config.modpacks.map(modpack => {
        console.log(`Processing modpack: ${modpack.name}`);

        const modpackDir = path.join(config.modpackStorageDir, modpack.name.replace(/ /g, '-'));
        console.log(`Modpack directory: ${modpackDir}`);

        const versionFilePath = path.join(modpackDir, 'version.json');
        const iconFilePath = path.join(modpackDir, 'icon.png');

        // Construct download link
        const downloadLink = `${config.server.domain}/modpacks/${modpack.name.replace(/ /g, '-')}.zip`;
        console.log(`Download link generated: ${downloadLink}`);

        const icon = fs.existsSync(iconFilePath) ? `${config.server.domain}/modpacks/${modpack.name.replace(/ /g, '-')}.png` : null;
        if (icon) {
            console.log('Icon file exists. Link generated.');
        } else {
            console.log('Icon file does not exist.');
        }

        let version = '';
        let changelog = '';

        // If the version file exists, extract the latest version and its changelog
        if (fs.existsSync(versionFilePath)) {
            console.log('Version file exists. Processing...');

            const versionFile = require(versionFilePath);
            version = Object.keys(versionFile).sort().pop();  
            changelog = versionFile[version];

            console.log(`Latest version: ${version}`);
            console.log(`Changelog for latest version: ${changelog}`);
        } else {
            console.log('Version file does not exist.');
        }

        return {
            name: modpack.name,
            version,
            changelog,
            downloadLink,
            icon
        };
    });

    console.log('Finished processing GET request on packListRouter. Sending response...');
    res.json(modpacks);
});

console.log('packListRouter.js module loaded successfully.');
module.exports = router;
