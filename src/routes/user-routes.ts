import { Router, Request, Response } from "express";
import pool from "../database/connection";
import bcrypt, { hash } from 'bcrypt';
import generateToken from "../utilities/generate-token";

const saltround = 10;
const usersRouter = Router();

usersRouter.get('/', (req: Request, res: Response) => {
    return res.json("OK");
})

usersRouter.get('/users', (req: Request, res: Response) => {

    pool.getConnection((err: any, conn: any) => {
        if (err) {
            console.log('Entered into error')
            console.log(err)
            res.send({
                sucess: false,
                statusCode: 500,
                message: 'Getting error during the connection'
            })
            return;
        } else {
            conn.query('SELECT * from users', (err: any, rows: any) => {
                if (err) {
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
        }
    })
});

usersRouter.post('/register', (req: Request, res: Response) => {


    pool.getConnection((err: any, conn: any) => {
        if (err) {
            console.log('Entered into error')
            console.log(err)
            res.send({
                sucess: false,
                statusCode: 500,
                message: 'Getting error during the connection'
            })

            return;
        }
        bcrypt.hash(req.body.senha, saltround, (error: any, hash: string) => {


            if (err) {
                conn.release()
                return res.send({
                    sucess: false,
                    statusCode: 400
                });
            }

            conn.query('INSERT INTO users2 (email, senha) values (?, ?)', [req.body.email, hash], (err: any, rows: any) => {
                if (!err) {
                    res.send({
                        message: 'Sucess',
                        statusCode: 200,
                        data: req.body
                    });
                }

                //Close the connection
                conn.release()
            })

        });
    })
});

usersRouter.post('/login', (req: Request, res: Response) => {

    pool.getConnection((err: any, conn: any) => {
        if (err) {
            console.log('Entered into error')
            console.log(err)
            return res.send({
                sucess: false,
                statusCode: 500,
                message: 'Getting error during the connection'
            });

        }

        conn.query('SELECT * from users2 where email =?', [req.body.email], (err: any, rows: any) => {

            if (rows.length) {
                const hash = rows[0].senha;

                bcrypt.compare(req.body.senha, hash, (err, result) => {

                    if (err) {
                        res.send({
                            message: 'failed',
                            statusCode: '500',
                            data: err
                        });
                    }

                    if (result) {
                        res.send({
                            message: 'Sucess',
                            statusCode: '200',
                            data: {token: generateToken(req.body.email)}
                        });

                    } else {
                        return res.send({
                            message: 'failed',
                            statusCode: '500',
                            data: err
                        })
                    }
                })

                //Close the connection
                conn.release()

            }
        })
    }
    )
});

export default usersRouter;