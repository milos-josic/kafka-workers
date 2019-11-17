import { MongoClient, MongoError } from "mongodb";


export class TaskRepository{
    constructor(){
        MongoClient.connect('connection string',  {
            // retry to connect for 60 times
            reconnectTries: 60,
            // wait 1 second before retrying
            reconnectInterval: 1000
        }, (error: MongoError, result: MongoClient) => {

        })
    }
}