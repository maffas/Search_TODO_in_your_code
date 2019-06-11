const { getFileInDir, readFile,  getFileName } = require('./fileSystem');
const { readLine,  writeLine } = require('./console');

var todo = [];

app();

function app () {
    const files = getFiles();
    files.forEach(function(file, i, files) {
        searchTodo (file)
    });
    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles () {
    var files = [];
    const filePaths = getFileInDir(process.cwd(), 'js');
    files = filePaths.map(path => readFile(path));
    filePaths.forEach(function(item, i, filePaths) {
        files[i] += '\n' + getFileName(item);
    });
    return files;
}

function searchTodo (file) {
    file = file.split('\n')
    const re = /\/\/\s*TODO(?=[\s*]|[\s:])\s*:?\s*/i   //     todo:   проверяет на наличе в начале строки симвлово '//' добавить todo в разных регистрах !
    file.forEach(function(item, i, file) {
        if (item.match(re)) {
            var obj = createTodoObject(item.split(re)[1], file[file.length-1]);
            todo.push(obj);
            }
      });
}

function createTodoObject (file, fileName){
    var obj = {};  
    obj.important = /!/.test(file) ? file.match(/!/g).length  : ''
    file = file.split(';');
    if (file.length == 1) {
        obj.user  = '';
        obj.date = '';
        obj.comment = file[0].trim();
        obj.name = fileName;
    } else {
        obj.user = file[0] === undefined ? '' : file[0].trim();
        obj.date = file[1] === undefined ? '' : checkDate(file[1].trim());
        obj.comment = file[2] === undefined ? '' : file[2].trim();
        obj.name = fileName.trim();
    }
    return obj;
}

function checkDate(date) {
    if( date == '') return '';
    if (!/^\d{4}(-\d{2})?(-\d{2})?$/.test(date))
        return 'not correct';
    else return date;
}

function processCommand (command) {
    switch (command.split(' ')[0]) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            writeLine(todo);
            break;
        case 'important':
            writeLine(todo, command);
            break;
        case 'user':
            writeLine(todo, command);
            break;
        case 'sort':
            writeLine(todo, command);
            break;
        case 'date':
            writeLine(todo, command);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it !!
