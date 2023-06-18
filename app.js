const express = require('express');
const path = require('path');
const packListRouter = require('./src/api/packListRouter');
const { checkForUpdatesAndPackage } = require('./src/utils/packager');
const fs = require('fs');

const app = express();

console.log('Initializing app...');

const dataDir = path.join(__dirname, 'src', 'data');
const modpackStorageDir = path.join(dataDir, 'modpack-storage');
const publicDir = path.join(dataDir, 'public');

console.log(`Creating directories: '${dataDir}', '${modpackStorageDir}', '${publicDir}'`);
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(modpackStorageDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

let config = require('./config.json');
config.modpackStorageDir = modpackStorageDir;
config.publicDir = publicDir;
console.log('Configuration loaded.');

app.use('/modpacks', express.static(path.join(publicDir, 'modpacks')));

app.use('/api', packListRouter);

const checkAndPackageModpacks = () => {
    checkForUpdatesAndPackage(config)
        .then(() => console.log('Modpacks checked for updates and packaged.'))
        .catch(err => console.error('Error occurred while checking for updates and packaging modpacks:', err));
};
checkAndPackageModpacks();


const updateInterval = config.server.update_interval * 60000; // Convert minutes to milliseconds
setInterval(checkAndPackageModpacks, updateInterval);
console.log(`Scheduled modpacks updates every ${config.server.update_interval} minutes.`);
    

app.listen(config.server.port, () => console.log(`Server is listening on port ${config.server.port}`));

