import { ITaskHandler } from "../tasks/task-handler";
import { Task, ExampleTaskData } from "../domain/task";


export class ExampleTaskHandler implements ITaskHandler {

    handle(task: Task): Promise<any> {

        return new Promise((resolve, reject) => {
            const taskData = JSON.parse(task.Data) as ExampleTaskData

            setTimeout(() => {
                return resolve();
            }, 1000);
        })
    }
}