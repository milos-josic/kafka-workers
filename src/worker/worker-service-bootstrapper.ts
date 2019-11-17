import { WorkerService } from "./worker-service";
import { KafkaClientFactory } from "./common/kafka/kafka-client-factory";
import { MessageHandler } from "./message-handler";
import { TaskHandlerProvider } from "./tasks/task-handler-provider";
import { ExampleTaskHandler } from "./handlers/upload-file-task-handler";
import { TaskStateManager } from "./tasks/task-state-manager";

export class WorkerServiceBootstrapper {
  private static workerService: WorkerService;
  private static messageHandler: MessageHandler;

  public static init(): void {

    const kafkaFactory = new KafkaClientFactory();
    const uploadFileTaskHandler = new ExampleTaskHandler();
    const taskHandlerProvider = new TaskHandlerProvider(uploadFileTaskHandler);
    const taskStateManager = new TaskStateManager();
    
    this.messageHandler = new MessageHandler(taskHandlerProvider, taskStateManager)
    this.workerService = new WorkerService(kafkaFactory, this.messageHandler);
  }

  public static getWorkerService(workerId: string) {

    this.workerService.setWorkerId(workerId);
    this.messageHandler.setWorkerId(workerId);

    return this.workerService;
  }
}