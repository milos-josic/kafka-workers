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
    }

    public async scheduleTasks(): Promise<any> {
        await this.taskCreator.create('Example', 'tenantID', { Id: this.taskId++, createdOn: new Date() });
    }

    public async scheduleCleanUpTask(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return resolve();
        })
    }
}