import { IKafkaClientFactory } from "../worker/kafka/kafka-client-factory";
import { Producer, RecordMetadata } from "kafkajs";
import { Environment } from "../environment";
import { Task } from "../worker/domain/task";
import { ITaskCreator } from "../worker/tasks/task-creator";
import { debug } from "util";


export class SchedulerService {
    producer: Producer;
    taskId: number = 0;

    constructor(
        private kafkaFactory: IKafkaClientFactory,
        private taskCreator: ITaskCreator) {
        this.producer = this.kafkaFactory.getProducer();

        // this.producer.on('error', (error) => {
        //     console.error(error);
        //     //return reject(error);
        // })
    }

    public async scheduleTasks(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            console.log('schedule tasks');
            //how can we make schedulers concurent??
            //we should when new document get's created create a task on kafka, but what if it fails??

            //check if there are new files since last check 

            debugger;
            await this.taskCreator.create('Example', 'tenantID', { Id: this.taskId++, createdOn: new Date() });


            return resolve();
        })
    }

    public async scheduleCleanUpTask(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return resolve();
        })
    }
}