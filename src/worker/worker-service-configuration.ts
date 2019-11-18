

export interface IWorkerServiceConfiguration{
    getTopicName();
    getTasksCollectionName(): string;
    getTasksDbName(): string;
}