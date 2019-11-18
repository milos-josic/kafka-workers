import { Task } from "../domain/task";
import { ITaskHandler } from "./task-handler";
import { ExampleTaskHandler } from "../handlers/upload-file-task-handler";

export interface ITaskHandlerProvider {
    getHandler(task: Task): ITaskHandler;
}

export class TaskHandlerProvider implements ITaskHandlerProvider {
    constructor(private exampleTaskHandler: ExampleTaskHandler){

    }

    getHandler(task: Task): ITaskHandler {
        switch (task.TaskType) {
            case 'Example':
                return this.exampleTaskHandler;
                break;
            default:
                throw new Error("Method not implemented.");
        }
    }
}