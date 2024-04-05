import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

export const createApp = ({ movieModel }) => {
    const PORT = process.env.PORT ?? 3000
    
    const app = express()
    app.use(json())
    // CORS pre-flight
    // realiza una petición OPTIONS para saber si el servidor permite la petición
    // PUT/PATCH/DELETE
    app.use(corsMiddleware())
    
    app.disable('x-powered-by')
    
    app.use('/movies', createMovieRouter({ movieModel }))
    
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`)
    })    
}