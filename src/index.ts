import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/bands", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`SELECT * FROM bands;`)
        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/bands", async (req: Request, res: Response) => {
    try {
            const id = req.body.id
            const name = req.body.name
            if(typeof id !== "string"){
                res.status(400)
                throw new Error("Id inválido - deve ser uma string")
            }
            if(typeof name !== "string"){
                res.status(400)
                throw new Error("Name inválido - deve ser uma string")
            }

            if(!id.length){
                res.status(400)
                throw new Error("'Id' inválido - id não pode ser vazio")
            }
            await db.raw(`INSERT INTO bands(id, name) VALUES ("${id}", "${name}");`)
            res.status(201).send("Banda criada com sucesso!")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
        
    }
})

app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newid = req.body.id
        const newname = req.body.name

        if(id !== undefined && newid !== undefined){
            if(typeof id !== "string"  && typeof newid !== "string"){
                res.status(400)
                throw new Error("Id inválido - deve ser uma string")
            }
            if(!id.length && !newid.length){
                res.status(400)
                throw new Error("'Id' inválido - id não pode ser vazio")
            }

        }

        if(newname !== undefined){
            if(typeof newname !== "string"){
                res.status(400)
                throw new Error("Name inválido - deve ser uma string")
            }
            if(!newname.length){
                res.status(400)
                throw new Error("'Id' inválido - id não pode ser vazio")
            }
        }

        const [band] = await db.raw(`SELECT * FROM bands WHERE id = "${id}";`)

        if(band){
            await db.raw(`UPDATE bands 
            SET 
                id = "${newid  ||band.id}", 
                name = "${newname || band.name}"
            WHERE id = "${id}";`)
            res.status(200).send("Banda atualizada com sucesso!")
        }
        else{
            res.status(404).send("Banda não encontrada")
        }



    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})