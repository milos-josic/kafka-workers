import { RetryPolicy } from "./domain/retry-policy";


export interface IWorkerServiceConfiguration{
    getRetryPolicy(): RetryPolicy;
    getMongoConnectionString(): string;
    getTopicName(): string;
    getTasksCollectionName(): string;
    getExecutionCollectionName(): string;
    getTasksDbName(): string;
}