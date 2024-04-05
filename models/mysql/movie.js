import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
    host: 'localhost',
    user: 'braulio',
    port: 3306,
    password: 'securepassword',
    database: 'moviesdb'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class MovieModel {
    static async getAll ({ genre }) {
        if (genre) {        
            const [movies] = await connection.query(
                `select title, year, director, duration, poster, rate, bin_to_uuid(movie.id) as id from movie
                inner join movie_genre
                on movie.id = movie_genre.movie_id
                inner join genre
                on genre.id = movie_genre.genre_id
                where lower(genre.name) = ?;`,
                [genre.toLowerCase()]
            )
            return movies
        }

        const [movies] = await connection.query(
            'select title, year, director, duration, poster, rate, bin_to_uuid(id) as id from movie;',
        );
        
        return movies
    }

    static async getById ({id}) {
        const [movie] = await connection.query(
            `select title, year, director, duration, poster, rate, bin_to_uuid(id) as id from movie
            where id = uuid_to_bin(?);`,
            [id]
        );

        if (movie.length === 0) return null

        return movie
    }

    static async create({input}) {
        const {
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query('select uuid();')
        const [{ 'uuid()': uuid }] = uuidResult

        try {
            await connection.query(
                `insert into movie (id, title, year, director, duration, poster, rate)
                values (uuid_to_bin("${uuid}"), ?, ?, ?, ?, ?, ?);`,
                [title, year, director, duration, poster, rate])
        } catch (error) {
            console.error(error)
            throw new Error('Error creating movie')
        }

        return await MovieModel.getById({ id: uuid })
    }

    static async delete({ id }) {
        try {
            await connection.query(
                'delete from movie where id = uuid_to_bin(?);',
                [id]
            )
        } catch (error) {
            console.error(error)
            throw new Error('Error deleting movie')
        }
    }

    static async update({ id, input }) {
        let values = []
        let query = 'update movie set '

        for (let key in input) {
            if (input[key] !== undefined) {
                query += `${key} = ?, `
                values.push(input[key])
            }
        }

        query = query.slice(0, -2)
        query += ' where id = uuid_to_bin(?);'
        values.push(id)

        try {
            await connection.query(query, values)
        } catch (error) {
            console.error(error)
            throw new Error('Error updating movie')
        }

        return await MovieModel.getById({ id })
    }
}