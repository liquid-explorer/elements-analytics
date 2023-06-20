import { RequestHandler } from "express"

export const logger: RequestHandler = (req, _, next) => {
    console.log(req.method, req.url)
    next()
}