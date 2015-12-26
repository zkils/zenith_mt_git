
function login(){
    location.href = "/users";
}

function conn(){


    connection.connect();

    connection.query('SELECT * FROM user', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });

    connection.end();
}