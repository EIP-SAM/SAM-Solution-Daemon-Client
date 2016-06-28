# SAM-Solution-Daemon-Client
System Administration Manager - Daemon Client

## Description
### Project
SAM-Solution is a __management tool__ for __IT-infrastructures__, intended for companies.
It allows to centralize __system and software migrations__, as well as __backup and restoration__ of __user data__.
This tool design goal is to __help the system adminstrator__ of a company in his work, and to be __easily usable by the final user__.

This project fits into the [Epitech Innovative Projects](http://www.epitech.eu/epitech-innovative-projects.aspx) program *(link in french)*. You can find our showcase website [here](http://eip.epitech.eu/2017/samsolution).

### Repository
*Repository description (in construction)*

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

## API
### Daemon module
*(in construction)*
* Prefix : `daemon`
* Messages :
    * `alive`
      * 

## Contribution
### Code
This project being a school project, we are not yet open to external code contribution.

### Issues
Suggestions and bugs reporting are always welcome! Don't hesitate to open an issue if you have something to say.

## Who do I talk to?
We are a team of nine [Epitech](https://en.wikipedia.org/wiki/Epitech) students. You can contact us via this address samsolution_2017@labeip.epitech.eu

### Authors
* Alex Michaux *(Web GUI referent)*
* Christopher Vuong
* Claire Almozinos *(Time master, Web GUI referent)*
* Etienne Leroy
* Jean-Stéphane Victor
* Jérémy Bernard *(Project leader)*
* Nicolas Chauvin *(Lead developer, Technical referent)*
* Stéphane Phongphaysanne
* Steven Gouasbault *(System administration referent)*

## License
GNU Lesser General Public License Version 3 (LGPL-3.0)  
See full license [here](https://github.com/EIP-SAM/SAM-Solution-Daemon-Client/blob/develop/LICENSE)
