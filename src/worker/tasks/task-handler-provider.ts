import { Task } from "../domain/task";
import { ITaskHandler } from "./task-handler";

export interface ITaskHandlerProvider {
    getHandler(task: Task): ITaskHandler;
}