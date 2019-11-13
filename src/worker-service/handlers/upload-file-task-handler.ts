import { ITaskHandler } from "../tasks/task-handler";
import { Task, UploadFileTaskData } from "../../common/domain/task";


export class UploadFileTaskHandler implements ITaskHandler{
    
    handle(task:  Task): Promise<any> {

        const taskData = JSON.parse(task.Data) as UploadFileTaskData
        
        throw new Error("Method not implemented.");
    }
}