const readline = require('readline');


// TODO ; 2018-10-01; Можно ли написать более лаконично?

// TODO you can do it !!
// TODO you can do it !!
// TODO you can do it !!
// TODO you can do it !!
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function readLine(callback) {
    rl.on('line', callback); // TODO pe; 2015-08-10; а какая будет кодировка?
}

// TODO digi; 2016-04-08; добавить writeLine!!!
// TODO digi; 2016-04-08; добавить writeLine!!!
// TODO digi; 2016-04-08; добавить writeLine!!!
// TODO digi; 2016-04-08; добавить writeLine!!!

function writeLine(todo, mode){
    const header = {important: '!', user: 'user', date: 'date',comment:'comment', name:'fileName'}
    var cel = []
    if(mode)
    {
        switch (mode.split(' ')[0]) {
            case 'important':
                if (!/important$/.test(mode.trim())) {
                    console.log('wrong command');
                    return;
                } else {
                    todo = giveImportant(todo);
                    break;
                }
            case 'user':
                mode = mode.replace(/[^ ]+ /, '');
                todo = giveUserTodo(todo, mode);
                break;
            case 'sort':
                mode = mode.replace(/[^ ]+ /, '');
                if (!/(importance$|user$|date$)/.test(mode.trim())) {
                    console.log('wrong command');
                    return;
                } else {
                    todo = sort(todo, mode.trim())
                    break;
                }
            case 'date':
                mode = mode.replace(/[^ ]+ /, '');
                if (!mode.trim().match(/^\d{4}(-\d{2})?(-\d{2})?$/)) {
                    console.log('wrong command');
                    return;
                } else {
                    todo = dateSort(todo,mode.trim());
                    break;
                }
        }
    }
    for (var key in header) {
        cel.push(header[key].length);
    }
    cel = todo.length == 0 ? cel : giveMaxCel (todo, cel);
    cel = didCelCorrect(cel);

    console.log (createTable(header, cel, todo));
}

function giveMaxCel (todo, minCel) {
    var cel = [];
    for (var key in todo[0]){
        var max = todo[0][key].toString().length;
        todo.forEach(function(item, i, todo) {
            if (max < todo[i][key].toString().length) {
                max = todo[i][key].toString().length;
            } 
            if (max < minCel[i])
            max = minCel[i];
        });
        cel.push(max);
    }
    return cel;
}

function didCelCorrect(cel) {
    var cor = [1, 10, 10, 50, 15];
    cel.forEach(function(item, i, cel) {  
        if (item > cor[i]) {
            cel[i] = cor[i];
        }
    })
    return cel;
}

function createStr(obj, cel) {
    var str = '';
    var i = 0;
    for (var key in obj){
        if (key == 'important' && obj[key] != '') {
            str += '  ' + getSpace(cel[i], '!') + '  |';
        }
        else
            str += i != 4 ? '  ' + getSpace(cel[i], obj[key]) + '  |' : '  ' + getSpace(cel[i], obj[key]) + '  ';
            i++;
    }
    return str;  
}

function getSpace(cel, str) {
    if(str.length <= cel) {
        while (str.length < cel) {
            str += ' ';
        }
    } else {
        str = str.substr(0, cel-3) + '...'; 
    }
    return str;
}

function createDash (cel) {
    var dashQt = 24;
    var dash = '-';
    cel.forEach(function(item) {
        dashQt += item;
    })
    while (dash.length < dashQt) {
        dash += '-';
    }
    return dash;
}

function createTable(header, cel, todo) {
    var table = createStr(header, cel) + '\n';
    table += createDash(cel) + '\n'
    todo.forEach(function(item) {
        table += createStr(item, cel) + '\n';
    })
    if (todo.length != 0)
        table += createDash(cel) + '\n'
    return table;
}

function giveImportant(todo) {
    var sort = [];
    for(var i = 0; i < todo.length; i++){
        if (todo[i]['important'] != '') {
            sort.push(todo[i]); 
        } 
    }
    return sort;
}

function giveUserTodo(todo, user) {
    var sort = [];
    var re = new RegExp('^' + user, 'i');
    for(var i = 0; i < todo.length; i++) {
        if (re.test(todo[i]['user'])) {
            sort.push(todo[i]);
        } 
    }
    return sort;
}

function sort(todo, mode) {
    var sort = [];
    switch (mode) {
        case 'importance':
            sort = todo.slice().sort(compareImportant);
            break;
        case 'user':
            sort = todo.slice().sort(compareUser);
            sort = getCorrectUserSort(sort);
            break;
        case 'date':
            sort = todo.slice().sort(compareDate);
            break;
    }
    return sort;
}

function dateSort(todo, mode) {
    var sort = [];
    mode = new Date (mode);
    todo.forEach(function(item, i, todo) {
        if (new Date(todo[i]['date']) >= mode ) {
            sort.push(todo[i]);
        }
    })
    sort = sort.slice().sort(compareDate);
    sort.reverse()
    return sort;
}

function compareImportant(item1, item2) { //для группировки по важности
    return  item2.important - item1.important;
}

function compareUser(item1, item2) { //для группировки по пользователям
    if (item1.user.toUpperCase() > item2.user.toUpperCase()) return 1;
    if (item1.user.toUpperCase() < item2.user.toUpperCase()) return -1;
    return 0
}

function getCorrectUserSort(todo) {
    var sort = []
    todo.forEach(function(a, i, todo) {
        if (todo[i]['user'] != '') {
            sort.push(todo[i]);
        }
    });
    todo.forEach(function(a, i, todo) {
        if (todo[i]['user'] == '') {
            sort.push(todo[i]);
        }
    });
    return sort;
}

function compareDate(item1, item2) { //для группировки по датам
    if (item2.date == '' || item2.date == 'not correct') return -1;
    if (item1.date == '' || item1.date == 'not correct') return 1;
    item1 = correctDate(item1.date);
    item2 = correctDate(item2.date);
    if (new Date(item1) > new Date(item2)) return -1;
    if (new Date(item1) < new Date(item2)) return 1;
}

function correctDate(date) {
    if (new Date(date) == 'Invalid Date') {
        date = date.split('-')
        date = new Date(date[0],date[1], date[2])
        return (date.getFullYear().toString() + '-' + date.getMonth().toString() + '-' + date.getDate().toString())
    }
    else return date
}

module.exports = {
    readLine,
    writeLine,
};