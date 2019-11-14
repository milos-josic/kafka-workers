import { Task, TaskType } from "../../common/domain/task";
import { ITaskHandler } from "./task-handler";
import { UploadFileTaskHandler } from "../handlers/upload-file-task-handler";

export interface ITaskHandlerProvider {
    getHandler(task: Task): ITaskHandler;
}

export class TaskHandlerProvider implements ITaskHandlerProvider {
    constructor(private uploadFileTaskHandler: UploadFileTaskHandler){

    }

    getHandler(task: Task): ITaskHandler {
        switch (task.TaskType) {
            case TaskType.UploadFile:
                return this.uploadFileTaskHandler;
                break;
            case TaskType.Clean:
                break;
            case TaskType.VirusScann:
                break;
            default:
                throw new Error("Method not implemented.");
        }
    }
}