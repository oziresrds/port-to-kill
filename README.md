# Port To Kill
>It kill process that is running in an specific port

## Platforms tested
>Windows Server 2012 R2 | 
>MacOS High Sierra

## Prerequisites
>This project work with NodeJS in the server side
[NodeJS]: <https://nodejs.org>

## Installation
```
$ npm install port-to-kill
```
## Getting Started
```javascript
const portToKill = require('port-to-kill');
const port = 3000;


portToKill(port)
	.then(() => console.log('Kill port ', port))
	.catch(err => console.log(`Kill port ${ port }. Erro: `, err));
```

## Author

> * **Ozires R.S.O.F**

## License
This project is licensed under the MIT License
