const { exec } = require('child_process');

function portToKill(port) {
  return new Promise((resolve, reject) => {

    const unixCommand = `lsof -i tcp:${ port } | grep LISTEN | awk '{print $2}' | xargs kill -9`;
    const winCommand = `netstat -ano |findstr /I :${ port }.*listening`;

    if(process.platform === 'win32') {
      let processList = [];

      execCommandInShell(winCommand)
        .then(stdout => {
          stdout.match(/listening.*([0-9]+)/gi).toString().replace(/listening[^0-9]*([0-9]+)/gi, (match, process) => {
            if(!processList.includes(process)) processList.push(process);
          });
  
          execCommandInShell(mountWindowsCommand_TsKill(processList))
            .then(() => resolve())
            .catch(() => {
              execCommandInShell(mountWindowsCommand_TaskKill(processList))
                .then(() => resolve())
                .catch(err => reject(err));
            });
        })
        .catch(err => reject(err));
    }
    else {
      execCommandInShell(unixCommand)
        .then(() => resolve())
        .catch(err => reject(err));
    }

  });
}

function mountWindowsCommand_TsKill(processList) {
  // Applies To: Windows Vista, Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, Windows 8
  let command = '';

  processList.forEach((process, index) => {
    command += `${ index == 0 ? '' : '&&' } tskill ${ process }`;
  });

  return command;
}

function mountWindowsCommand_TaskKill(processList) {
  // Applies To: Windows Server (Semi-Annual Channel), Windows Server 2016, Windows Server 2012 R2, Windows Server 2012
  let command = '';

  processList.forEach((process, index) => {
    command += `${ index == 0 ? '' : '&&' } taskkill /F /PID ${ process }`;
  });

  return command;
}

function execCommandInShell(command) {
  return new Promise((resolve, reject) => {
    try {
      exec(command, (error, stdout, stderr) => {
        error ? reject(`Kill Port error: ${ error }`) : resolve(stdout);
      });
    }
    catch (error) {
      reject(`Kill Port error: ${ error }`);
    }
  });
}

module.exports = portToKill;