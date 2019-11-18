import { MongoClient, MongoError } from "mongodb";
import { Task } from "../domain/task";
import { IWorkerServiceConfiguration } from "../worker-service-configuration";

export interface ITaskRepository {
    insert(task: Task): Promise<any> 
}

export class TaskRepository {
    private init: boolean = false;
    client: MongoClient;
    constructor(private configuration: IWorkerServiceConfiguration) {

    }

    public initDb(): Promise<any> {
        return new Promise((resolve, reject) => {
            MongoClient.connect('connection string', {
                // retry to connect for 60 times
                reconnectTries: 60,
                // wait 1 second before retrying
                reconnectInterval: 1000
            }, (error: MongoError, result: MongoClient) => {
                if (error) {
                    return reject(error);
                }

                this.client = result;
                this.init = true;
                return resolve();
            })
        })
    }

    public insert(task: Task): Promise<any> {
        return new Promise((resolve, reject) => {
            this.validateInit();

            const db = this.client.db(this.configuration.getTasksDbName())
            const collection = db.collection(this.configuration.getTasksCollectionName())

            collection.insertOne(task, (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            })
        })
    }

    private validateInit() {
        if (!this.init) {
            throw new Error("Task Repository is not initialized. Call initDb method first.");
        }
    }
}