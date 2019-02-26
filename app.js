let express = require('express');
let knex = require('knex');

let app = express();

app.get('/api/genres', function(request, response){
    let connection = knex({
        client: 'sqlite3',
        connection: {
            filename: 'chinook.db'
        }
    });

    connection.select().from('genres').then((genres) => {
        response.json(genres);
    });
})

app.get('/api/genres/:id', function(request, response){
    let id = request.params.id;
    console.log(id);

    let connection = knex({
        client: 'sqlite3',
        connection: {
            filename: 'chinook.db'
        }
    });

    connection
        .select()
        .from('genres')
        .where('GenreId',id)
        .first()
        .then((genre) => {
            if (genre){
                response.json(genre);
            }else{
                response.status(404).json({
                    error: `Genre ${id} not found`
                });
            }
    });
})

app.get('/api/artists', function(request, response){
    if (request.query.filter === undefined){
        let connection = knex({
            client: 'sqlite3',
            connection: {
                filename: 'chinook.db'
            }
        });

        connection
            .select()
            .from('artists')
            .then((artists) => {
                if (artists){
                    let artistJson = artists.map(artist => JSON.stringify({"id":artist.ArtistId,"name":artist.Name}));
                    response.json(artistJson);
                }else{
                    response.status(500).json({
                        error: `Artists not found`
                    });
                }
            })
    }else{
        let connection = knex({
            client: 'sqlite3',
            connection: {
                filename: 'chinook.db'
            }
        });

        connection
            .select()
            .from('artists')
            .whereRaw('LOWER(Name) LIKE ?', '%'+request.query.filter.toLowerCase()+'%')
            .then((artists) => {
                if (artists){
                    let artistJson = artists.map(artist => JSON.stringify({"id":artist.ArtistId,"name":artist.Name}));
                    response.json(artistJson);
                }else{
                    response.status(500).json({
                        error: `Artists not found`
                    });
                }
            })
    }

})

app.listen(process.env.PORT || 8000);
