# ModMC-Server :package: :globe_with_meridians:

ModMC-Server is a Node.js application that serves modpacks. It can automatically update modpacks based on a configured interval. :rocket:

## Features :sparkles:

- Serve modpacks over HTTP :globe_with_meridians:
- Automatically update modpacks :arrows_counterclockwise:
- Pull the latest modpack updates from git repositories :inbox_tray:
- Automatically package modpacks into zip files for easy download :package: :floppy_disk:
- Serve modpack version information and changelogs :pencil:

## Installation :wrench:

1. Clone this repository to your local machine.
```
git clone https://github.com/yourusername/modpack-server.git
cd modpack-server
```

2. Install the dependencies.
```
npm i
```

3. Adjust the `config.json` to fit your needs. ⚙️

### Configuration ⚙️

You can customize the behavior of Modpack Server by modifying the \`config.json\` file:

- `modpacks`: An array of modpacks. Each modpack should have a name and path (git repository).
- `token`: Your authentication token if the repo is private
- `server.port`: The port on which the server will listen.
- `server.domain`: The domain that the server is running on (used for generating download links).
- `server.update_interval`: The interval (in minutes) at which the server should check for modpack updates.

## Usage :rocket:

To start the server, run:
```
npm start
```

Now, you can visit http://localhost:3000/api (or your configured domain and port) to view the modpack list. Individual modpacks can be downloaded from the link provided for each modpack in the response.

## Contributing :handshake:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

