import { IKafkaClientFactory } from "../common/kafka/kafka-client-factory";
import { HighLevelProducer } from "kafka-node";
import { Environment } from "../environment";
import { Task, TaskType } from "../common/domain/task";


export class SchedulerService {
    producer: HighLevelProducer;
    taskId: number = 0;

    constructor(private kafkaFactory: IKafkaClientFactory) {
        this.producer = this.kafkaFactory.getProducer();

        this.producer.on('error', (error) => {
            console.error(error);
            //return reject(error);
        })
    }

    public async scheduleTasks(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            console.log('schedule tasks');
            //how can we make schedulers concurent??
            //we should when new document get's created create a task on kafka, but what if it fails??

            //check if there are new files since last check 

            const task = new Task();
            task.TaskType = TaskType.UploadFile;
            task.Data = JSON.stringify({ Id: this.taskId++, createdOn: new Date() });

            const payloads = [
                { topic: Environment.getTopicName(), messages: [JSON.stringify(task)] },
            ];

            this.producer.send(payloads, function (err, data) {
                if (err) {
                    return reject(err);
                }
                console.log('producer has sent data to kafka %j', payloads);
                return resolve(data);
            });
        })
    }

    public async scheduleCleanUpTask(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return resolve();
        })
    }
}