import { MongoClient, MongoError, MongoCallback } from "mongodb";
import { Task } from "../domain/task";
import { IWorkerServiceConfiguration } from "../worker-service-configuration";
import { TaskExecution } from "../domain/task-execution";

export interface ITaskRepository {
    countFailedOccurance(taskId: string): Promise<number>;

    insertTask(task: Task): Promise<string>

    insertExecution(execution: TaskExecution): Promise<any>
}

export class TaskRepository implements ITaskRepository {

    private init: boolean = false;
    client: MongoClient;
    constructor(private configuration: IWorkerServiceConfiguration) {

    }

    public initDb(): Promise<any> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.configuration.getMongoConnectionString(), {
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

    public insertTask(task: Task): Promise<any> {
        return new Promise((resolve, reject) => {
            this.validateInit();

            const db = this.client.db(this.configuration.getTasksDbName())
            const collection = db.collection(this.configuration.getTasksCollectionName())

            collection.insertOne(task, (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result.insertedId);
            })
        })
    }

    public insertExecution(task: TaskExecution): Promise<any> {
        return new Promise((resolve, reject) => {
            this.validateInit();

            const db = this.client.db(this.configuration.getTasksDbName())
            const collection = db.collection(this.configuration.getExecutionCollectionName())

            collection.insertOne(task, (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            })
        })
    }

    public countFailedOccurance(taskId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.validateInit();

            const db = this.client.db(this.configuration.getTasksDbName())
            const collection = db.collection<TaskExecution>(this.configuration.getExecutionCollectionName())

            collection.find({ taskId: taskId }).count((error: MongoError, result: number) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            });
        })
    }

    private validateInit() {
        if (!this.init) {
            throw new Error("Task Repository is not initialized. Call initDb method first.");
        }
    }
}