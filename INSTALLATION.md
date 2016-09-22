# SAM-Solution-Daemon-Client install and run instructions

## Pre-requisites
### Hardware requirements
* Computational or memory client machine hardware capacities are theoretically not involving any problem regarding the execution flow of our solution. However, the more its capacities will be limited, the more slowly the execution flow will be.
* A computer possessing a common processor architecture, like __x86__, __x86_64__, __ARM__.  
  *Note: Only __x86_64__ architecture has been tested for now.*
* Client installation requires an active internet connexion.
* Server must be reachable via a local network or an internet connexion.

### Software requirements
* A modern and up to date __Linux__ operating system (like Debian/Ubuntu/Fedora/Archlinux/...), or a __Windows__ version `>= 8.1`.  
  *Note: It is important to note that, for experimental purposes only, in accordance with the actual development status, a modern version of __OS X__, may, for now, be still sufficient to make run the client.*
* A __node.js__ version `>= 5.4.X`
* A __npm__ version `>= 1.2.X`
* __git__ must be available through the command line

## Usage
### Installation (from source)
#### Clone this repository
```
$ git clone https://github.com/EIP-SAM/SAM-Solution-Daemon-Client.git
$ cd SAM-Solution-Daemon-Client
```

#### Select the desired version
##### Latest release version
```
$ git checkout release
```

##### Latest development version
```
$ git checkout develop
```

#### Install project `npm` dependencies
```
$ npm install
```

#### Configure the client
##### Copy the default configuration files
```
$ for f in config/*config.json.example; do cp "$f" "`echo $f | sed s/json.example/json/`"; done;
```

##### Configure client base
*Base client configuration (in construction)*

### Run
#### Launch the client
```
$ npm start
```
