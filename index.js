const { exec } = require('child_process');

function portToKill(port) {
  return new Promise((resolve, reject) => {

    const unixCommand = `lsof -i tcp:${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`;
    const winCommand = `netstat -ano |findstr /I :${port}.*listening`;

    if (process.platform === 'win32') {
      let processList = [];
      let commandToKillPort = '';

      const setProcessList = (process) => {
        if (!processList.includes(process)) processList.push(process);
      }

      exec(winCommand, (error, stdout, stderr) => {
        if (error) {
          return reject(`Kill Port error: ${error}`);
        }

        try {
          stdout
            .match(/listening.*([0-9]+)/gi)
            .toString()
            .replace(/listening[^0-9]*([0-9]+)/gi, (match, process) => setProcessList(process));

          processList.forEach((process, index) => {
            if (index == 0) {
              return commandToKillPort += `tskill ${process}`;
            }
            commandToKillPort += `&& tskill ${process}`;
          });

          exec(commandToKillPort, (error, stdout, stderr) => {
            if (error) {
              return console.error(`Kill Port error: ${error}`);
            }
            resolve();
          });

        }
        catch (error) {
          reject(`Kill Port error: ${error}`);
        }
      });
    }
    else {
      exec(unixCommand, (error, stdout, stderr) => {
        if (error) {
          return reject(`Kill Port error: ${error}`);
        }
        resolve();
      });
    }

  });
}

module.exports = portToKill;