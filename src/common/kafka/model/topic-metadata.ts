export class TopicMetadata{
    constructor(){
        this.Exists = false;
        this.NumberOfPartitions = 0;
    }
    
    public Exists: boolean;
    public NumberOfPartitions: number;
}