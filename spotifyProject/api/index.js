 var request = require('request');
    var authOptions1 = {
        url: 'https://api.spotify.com/v1/users/' + 'nilssohn' + '/playlists',
        body: JSON.stringify({
            'name': Communify,
            'public': false
        }),
        dataType:'json',
        headers: {
            'Authorization': 'Bearer ' + 'BQCiMOZMcBmpMG7dw8_ODbiV_y8XCskIobnvFXvAqmgBi5JMzeW_T5cqmBYbL0O810rXvT_DEEJONrQteVfEKhh2QbKns4WRlbGnaMhs30r-54F-wiz6WUPDnbwOCt9bja1xUVQxFLJDk6DUlQeZ98OhXn25_ajWvAJJWvVsAhat0XjEkjb7Cw4kAAaiMkB4y-rarsyq-H-NFQk7x4aT-ikVwtVv0JMhVAbNmL8c2aKN',
            'Content-Type': 'application/json',
        }
};

    request.post(authOptions1, function(error, response, body) {
        console.log(body);
});