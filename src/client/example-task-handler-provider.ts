import { ITaskHandlerProvider } from "../worker/tasks/task-handler-provider";
import { ExampleTaskHandler } from "../worker/handlers/upload-file-task-handler";
import { ITaskHandler } from "../worker/tasks/task-handler";
import { Task } from "../worker/domain/task";

 
 

export class ExampleTaskHandlerProvider implements ITaskHandlerProvider {
    constructor(private exampleTaskHandler: ExampleTaskHandler){

    }

    getHandler(task: Task): ITaskHandler {
        switch (task.TaskType) {
            case 'Example':
                return this.exampleTaskHandler;
                break;
            default:
                return this.exampleTaskHandler;
        }
    }
}