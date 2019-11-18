import { Task } from "../domain/task";
import { ITaskRepository } from "./task-repository";
import { IWorkerServiceConfiguration } from "../worker-service-configuration";
import { IKafkaClientFactory } from "../kafka/kafka-client-factory";
import { RecordMetadata } from "kafkajs";

export interface ITaskCreator {
    create(taskType: string, tenantId: string, taskData: any): Promise<any>
}

export class TaskCreator implements ITaskCreator {
    producer: any;

    constructor(
        private taskRepository: ITaskRepository,
        private configuration: IWorkerServiceConfiguration,
        private kafkaFactory: IKafkaClientFactory) {
        this.producer = this.kafkaFactory.getProducer();
    }

    public create(taskType: string, tenantId: string, taskData: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!taskType || !taskData || !tenantId) {
                return reject(new Error('taskType, tenantId and taskData are required.'));
            }

            let task = new Task();
            task.TaskType = taskType;
            task.Data = JSON.stringify(taskData);
            task.TenantId = tenantId;

            try {
                await this.taskRepository.insert(task);
            } catch (error) {
                return reject(error);
            }

            //produce message to Kafka

            const payloads = [
                { topic: this.configuration.getTopicName(), messages: [JSON.stringify(task)] },
            ];

            let metadata: RecordMetadata[] = await this.producer.send({
                topic: this.configuration.getTopicName(),
                messages: [{ value: JSON.stringify(task) }]
            });

            return resolve();
        })
    }
}