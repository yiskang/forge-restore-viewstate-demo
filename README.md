[![Node.js](https://img.shields.io/badge/Node.js-8.9.4-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-5.8.0-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)

# Autodesk Forge Viewpoint Management Panel Demo

## Overview

This sample is demonstrating how to manage viewpoints in a viewer panel:

 - Save current viewpoint (camera state) into db
 - Retrieve saved viewpoints from db via REST API
 - Store saved viewpoints with a single mouse-clicking on the docking panel

## Thumbnail 
![thumbnail](/thumbnail.jpg)

## Requirements

* node.js v8.9.4 or later

<a name="setup"></a>
## Setup

1. Download and install [Node.js](http://nodejs.org/) (that will install npm as well)
2. Download this repo anywhere you want
3. Execute 'npm install', this command will download and install the required node modules automatically for you. <br />
   ```bash
   npm install
   ```

<a name="UseOfTheSample"></a>
## Use of the sample

Before starting the server, you have to set the Forge credentials up.

- Mac OSX/Linux (Terminal)
   ```bash
   export FORGE_CLIENT_ID=<<YOUR_CLIENT_ID_FROM_DEVELOPER_PORTAL>>
   export FORGE_CLIENT_SECRET=<<YOUR_CLIENT_SECRET>>
   ```

- Windows (use **Node.js command line** from Start menu)
   ```bash
   set FORGE_CLIENT_ID=<<YOUR_CLIENT_ID_FROM_DEVELOPER_PORTAL>>
   set FORGE_CLIENT_SECRET=<<YOUR_CLIENT_SECRET>>
   ```


- Windows (use **Powershell** from Start menu)
   ```bash
   $env:FORGE_CLIENT_ID="<<YOUR_CLIENT_ID_FROM_DEVELOPER_PORTAL>>"
   $env:FORGE_CLIENT_SECRET="<<YOUR_CLIENT_SECRET>>"
   ```


Then Run the server <br />
   ```bash
   npm start
   ```

And visit http://127.0.0.1:8089 <br />


## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.

## Written by

Eason Kang <br />
Forge Partner Development <br />
https://developer.autodesk.com/ <br />
https://forge.autodesk.com/blog <br />