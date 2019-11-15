import { Task } from "../../common/domain/task";


export interface ITaskStateManager{
    setTaskFailed(task:  Task);
    setTaskFinished(task: Task, startedOn: Date, finishedOn: Date);
}

export class TaskStateManager implements ITaskStateManager{

    /** Task State Manager will store information that this task has failed.
     * It will also return if we should retry to execute it again.
     * Retry will be based on number of times this particular task has already failed and global retry policy.     * 
     */
    public setTaskFailed(task: Task): SetTaskFailedResponse {
       console.log(`set task failed ${JSON.stringify(task)}`);
       return {
           shouldRetry: true
       }
    }   
    
    /** Store information that task has successfuly finished*/
    public setTaskFinished(task: Task, startedOn: Date, finishedOn: Date) {
        console.log(`set task finished ${JSON.stringify(task)}`)
    }
}

export class SetTaskFailedResponse{
    public shouldRetry: boolean;
}