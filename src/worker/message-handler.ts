import { KafkaMessage } from "kafkajs";
import { Task } from "../common/domain/task";
import { ITaskHandlerProvider } from "./tasks/task-handler-provider";
import { ITaskStateManager, SetTaskFailedResponse } from "./tasks/task-state-manager";

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

            let task = JSON.parse(message.value.toString()) as Task;

            let startedOn: Date = new Date();

            let taskHandler = this.taskHandlerProvider.getHandler(task);

            try {
                await taskHandler.handle(task);
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

    setWorkerId(workerId: string) {
        this.workerId = workerId;
    }
}

export class MessageHandleResponse {
    public placeBackMessageOnKafka: boolean;
}