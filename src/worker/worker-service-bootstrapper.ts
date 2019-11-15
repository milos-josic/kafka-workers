import { WorkerService } from "./worker-service";
import { KafkaClientFactory } from "../common/kafka/kafka-client-factory";
import { MessageHandler } from "./message-handler";
import { TaskHandlerProvider } from "./tasks/task-handler-provider";
import { UploadFileTaskHandler } from "./handlers/upload-file-task-handler";

export class WorkerServiceBootstrapper {
  private static workerService: WorkerService;
  private static messageHandler: MessageHandler;

  public static init(): void {

    const kafkaFactory = new KafkaClientFactory();
    const uploadFileTaskHandler = new UploadFileTaskHandler();
    const taskHandlerProvider = new TaskHandlerProvider(uploadFileTaskHandler);

    this.messageHandler = new MessageHandler(taskHandlerProvider)
    this.workerService = new WorkerService(kafkaFactory, this.messageHandler);
  }

  public static getWorkerService(workerId: string) {

    this.workerService.setWorkerId(workerId);
    this.messageHandler.setWorkerId(workerId);

    return this.workerService;
  }
}