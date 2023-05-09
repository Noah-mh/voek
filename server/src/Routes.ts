import { Express, Request, Response } from 'express'
import { processGetAllProductsOfSeller } from './controller/seller.controller'

export default function (app: Express) {
    app.get('/', (req: Request, res: Response) => {
        res.send('Done')
    })

    app.get('/products/:sellerId', processGetAllProductsOfSeller);
}