import express from 'express'
import { Request, Response} from 'express'
import bodyParser, { json } from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/:id', (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.post('/', (req: Request, res: Response)=>{
    res.send({
        data: req.body
    })
})

app.listen(3000, ()=> console.log("Server is running!"))