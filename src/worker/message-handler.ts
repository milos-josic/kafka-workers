import { Message } from "kafka-node";
import { Task } from "../common/domain/task";
import { ITaskHandlerProvider } from "./tasks/task-handler-provider";

export interface IMessageHandler {
    handle(message: Message): Promise<any>;
}

export class MessageHandler implements IMessageHandler {

    private workerId: string;

    constructor(
        private taskHandlerProvider: ITaskHandlerProvider) {
    }

    public async handle(message: Message): Promise<any> {
        return new Promise(async (resolve, reject) => {
            
            console.log(`Worker ${this.workerId} received offset ${message.offset}, partition ${message.partition} from kafka %j`, message.value.toString());

            let task = JSON.parse(message.value.toString()) as Task; 

            task.StartedOn = new Date();

            let taskHandler = this.taskHandlerProvider.getHandler(task);

            await taskHandler.handle(task);

            console.log(`Worker ${this.workerId}  has finished handling task %j`, task);

            return resolve();
        })
    }

    setWorkerId(workerId: string) {
        this.workerId = workerId;
    }
}