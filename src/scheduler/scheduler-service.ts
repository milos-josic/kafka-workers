import { IKafkaClientFactory } from "../worker/common/kafka/kafka-client-factory";
import { Producer, RecordMetadata } from "kafkajs";
import { Environment } from "../environment";
import { Task } from "../worker/common/domain/task";


export class SchedulerService {
    producer: Producer;
    taskId: number = 0;

    constructor(private kafkaFactory: IKafkaClientFactory) {
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
            const task = new Task();
            task.TaskType = 'Example';
            task.Data = JSON.stringify({ Id: this.taskId++, createdOn: new Date() });

            const payloads = [
                { topic: Environment.getTopicName(), messages: [JSON.stringify(task)] },
            ];


            let metadata: RecordMetadata[] = await this.producer.send({
                topic: Environment.getTopicName(),
                messages: [ {value: JSON.stringify(task) } ]
            })

            console.log(metadata);

            return resolve(metadata);           
        })
    }

    public async scheduleCleanUpTask(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return resolve();
        })
    }
}