import { Task } from "../domain/task";

export interface ITaskHandler{
    handle(task: Task): Promise<any>;
}