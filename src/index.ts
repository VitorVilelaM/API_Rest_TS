import express from 'express'
import mysql from 'mysql'
import { Request, Response} from 'express'
import bodyParser, { json } from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/:id', (req: Request, res: Response) => {
    
    var pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'root123',
        database: 'testapi',
    })
    
    pool.getConnection((err: any, conn: any)=>{
        if(err){
            console.log('Entered into error')
            console.log(err)
            res.send({
                sucess: false,
                statusCode: 500,
                message: 'Getting error during the connection'
            })

            return;
        }

        console.log('The id: '+ req.params.id)

        conn.query('SELECT * from users where id=?', [req.params.id], (err: any, rows: any)=>{
            if(err){
                conn.release()
                return res.send({
                    sucess: false,
                    statusCode: 400
                });
            }

            res.send({
                message: 'Sucess',
                statusCode: 200,
                data: rows
            });

            //Close the connection
            conn.release()
        })
    })
});

app.post('/', (req: Request, res: Response)=>{
    res.send({
        data: req.body
    })
})

app.listen(3000, ()=> console.log("Server is running!"))