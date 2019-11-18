import { Task } from "../domain/task";
import { ITaskRepository } from "./task-repository";
import { TaskExecution } from "../domain/task-execution";
import { IWorkerServiceConfiguration } from "../worker-service-configuration";
import { RetryPolicy } from "../domain/retry-policy";


export interface ITaskStateManager {
    setTaskFailed(request: SetTaskFailedRequest);
    setTaskFinished(request: SetTaskFinishedRequest);
}

export class TaskStateManager implements ITaskStateManager {

    constructor(
        private taskRepository: ITaskRepository,
        private config: IWorkerServiceConfiguration) {
    }

    /** Task State Manager will store information that this task has failed.
     * It will also return if we should retry to execute it again.
     * Retry will be based on number of times this particular task has already failed and global retry policy.     * 
     */
    public async setTaskFailed(request: SetTaskFailedRequest): Promise<SetTaskFailedResponse> {
        console.info(`set task failed ${JSON.stringify(request)}`);
        console.info(`set task finished ${JSON.stringify(request)}`)

        let execution: TaskExecution = {
            task: request.task,
            tenantId: request.task.TenantId,
            taskId: request.task._id,
            finishedOn: null,
            offset: request.offset,
            partition: request.partition,
            startedOn: request.startedOn,
            workerId: request.workerId,
            error: request.error
        };

        await this.taskRepository.insertExecution(execution);

        let retryPolicy: RetryPolicy = this.config.getRetryPolicy();

        let shouldRetry: boolean = false;

        if (retryPolicy.retryCount > 0) {
            await this.taskRepository.countFailedOccurance(request.task._id);
        }

        return {
            shouldRetry: shouldRetry
        }
    }

    /** Store information that task has successfuly finished*/
    public async setTaskFinished(request: SetTaskFinishedRequest) {
        console.info(`set task finished ${JSON.stringify(request)}`)

        let execution: TaskExecution = {
            task: request.task,
            tenantId: request.task.TenantId,
            taskId: request.task._id,
            finishedOn: request.finishedOn,
            offset: request.offset,
            partition: request.partition,
            startedOn: request.startedOn,
            workerId: request.workerId,
            error: null
        };

        await this.taskRepository.insertExecution(execution);
    }
}

export class SetTaskFailedResponse {
    public shouldRetry: boolean;
}

export class SetTaskStatusRequestBase {
    task: Task;
    workerId: string;
    partition: number;
    offset: string;
}

export class SetTaskFinishedRequest extends SetTaskStatusRequestBase {
    startedOn: Date;
    finishedOn: Date;
}

export class SetTaskFailedRequest extends SetTaskStatusRequestBase {
    startedOn: Date;
    error: Error;
}