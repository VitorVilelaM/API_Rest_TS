import { Router, Request, Response } from "express";
import pool from "../database/connection";
const usersRouter = Router();

usersRouter.get('/', (req: Request, res: Response)=>{
    return res.json("OK");
})

usersRouter.get('/:id', (req: Request, res: Response) => {
    
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

        conn.query('SELECT * from users',(err: any, rows: any)=>{
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

export default usersRouter;