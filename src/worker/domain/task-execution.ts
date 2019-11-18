import { Task } from "./task";


export class TaskExecution{
    public taskId: string;

    public tenantId: string;

    public task: Task;

    public workerId: string;

    public partition: number;
    
    public offset: string;

    public startedOn: Date;

    public finishedOn: Date; 

    public error: Error;
}