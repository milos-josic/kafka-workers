import { Task } from "../../common/domain/task";

export interface ITaskHandler{
    handle(task: Task): Promise<any>;
}