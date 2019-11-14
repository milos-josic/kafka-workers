import { ITaskHandler } from "../tasks/task-handler";
import { Task, UploadFileTaskData } from "../../common/domain/task";


export class UploadFileTaskHandler implements ITaskHandler {

    handle(task: Task): Promise<any> {

        return new Promise((resolve, reject) => {
            const taskData = JSON.parse(task.Data) as UploadFileTaskData

            setTimeout(() => {
                return resolve();
            }, 1000);
        })
    }
}