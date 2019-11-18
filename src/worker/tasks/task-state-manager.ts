import { Task } from "../domain/task";


export interface ITaskStateManager{
    setTaskFailed(request: SetTaskFailedRequest);
    setTaskFinished(request: SetTaskFinishedRequest);
}

export class TaskStateManager implements ITaskStateManager{

    /** Task State Manager will store information that this task has failed.
     * It will also return if we should retry to execute it again.
     * Retry will be based on number of times this particular task has already failed and global retry policy.     * 
     */
    public setTaskFailed(request: SetTaskFailedRequest): SetTaskFailedResponse {
       console.info(`set task failed ${JSON.stringify(request)}`);
       return {
           shouldRetry: true
       }
    }   
    
    /** Store information that task has successfuly finished*/
    public setTaskFinished(request: SetTaskFinishedRequest) {
        console.info(`set task finished ${JSON.stringify(request)}`)
    }
}

export class SetTaskFailedResponse{
    public shouldRetry: boolean;
}

export class SetTaskStatusRequestBase{
    task: Task;
    workerId: string;
    partition: number;
    offset: string;
}

export class SetTaskFinishedRequest extends SetTaskStatusRequestBase{
    startedOn: Date;
    finishedOn: Date;   
}

export class SetTaskFailedRequest extends SetTaskStatusRequestBase{
    startedOn: Date;
    error: Error;   
}