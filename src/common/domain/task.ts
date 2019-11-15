

export class Task{
    public TaskType: TaskType;

    public Data: string;   
}

export enum TaskType{
    UploadFile = 0,
    VirusScann = 1,
    Clean = 3
}

export class UploadFileTaskData{
    public TempFilePath: string;
}