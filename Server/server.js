import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { OpenAI } from 'openai'

dotenv.config();


const openai = new OpenAI({
    apiKey: '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',
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello world!'
    })
})

app.post('/', async (req, res) => {

    try {
        const promt = req.body.promt;
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            prompt: `${promt}`,
            temperature: 0.5,
            max_tokens: 256,
            top_p: 1,
            frecuency_penalty: 0,
            presence_penalty: 0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(3000, () => console.log('Server is running on port http://localhost:3000'));