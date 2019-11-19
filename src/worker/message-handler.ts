import { KafkaMessage } from "kafkajs";
import { Task } from "./domain/task";
import { ITaskStateManager, SetTaskFailedResponse } from "./tasks/task-state-manager";
import { ITaskHandlerProvider } from "./tasks/task-handler-provider";

export interface IMessageHandler {
    handle(message: KafkaMessage, partition: number): Promise<MessageHandleResponse>;
}

export class MessageHandler implements IMessageHandler {

    private workerId: string;

    constructor(
        private taskHandlerProvider: ITaskHandlerProvider,
        private taskStateManager: ITaskStateManager) {
    }

    public async handle(message: KafkaMessage, partition: number): Promise<MessageHandleResponse> {
        return new Promise(async (resolve, reject) => {
            let response = new MessageHandleResponse();

            console.log(`Worker ${this.workerId} received offset ${message.offset}, partition ${partition} from kafka %j`, message.value.toString());

            let task = this.getTaskFromMessage(message);

            if (!task) {
                console.log('Non valid task in Kafka Message.');
                return resolve(response);
            }

            let startedOn: Date = new Date();

            let taskHandler = this.taskHandlerProvider.getHandler(task);

            try {
                response.nextTasks = await taskHandler.handle(task);
            } catch (error) {

                console.error(error);

                let setTaskFailedResponse: SetTaskFailedResponse = await this.taskStateManager.setTaskFailed({
                    task: task,
                    startedOn: startedOn,
                    partition: partition,
                    offset: message.offset,
                    workerId: this.workerId,
                    error: error
                });

                response.placeBackMessageOnKafka = setTaskFailedResponse.shouldRetry;

                return resolve(response)
            }

            let finishedOn: Date = new Date();

            await this.taskStateManager.setTaskFinished({
                task: task,
                startedOn: startedOn,
                finishedOn: finishedOn,
                partition: partition,
                offset: message.offset,
                workerId: this.workerId
            });

            console.log(`Worker ${this.workerId}  has finished handling task %j`, task);

            return resolve(response);
        })
    }

    public setWorkerId(workerId: string) {
        this.workerId = workerId;
    }

    private getTaskFromMessage(message: KafkaMessage) {
        try {
            return JSON.parse(message.value.toString()) as Task
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export class MessageHandleResponse {
    public placeBackMessageOnKafka: boolean;
    
    public nextTasks: Task[];
}