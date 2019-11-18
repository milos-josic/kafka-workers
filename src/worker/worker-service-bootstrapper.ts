import { WorkerService } from "./worker-service";
import { KafkaClientFactory } from "./kafka/kafka-client-factory";
import { MessageHandler } from "./message-handler";
import { TaskHandlerProvider } from "./tasks/task-handler-provider";
import { ExampleTaskHandler } from "./handlers/upload-file-task-handler";
import { TaskStateManager } from "./tasks/task-state-manager";
import { TaskRepository } from "./tasks/task-repository";
import { TaskCreator } from "./tasks/task-creator";
import { IWorkerServiceConfiguration } from "./worker-service-configuration";

export class WorkerServiceBootstrapper {
  private static workerService: WorkerService;
  private static messageHandler: MessageHandler;
  static taskCreator: TaskCreator;

  public static init(configuration: IWorkerServiceConfiguration): void {

    if (!configuration) {
      throw new Error('Configuration cannot be null.')
    }

    const kafkaFactory = new KafkaClientFactory();
    const uploadFileTaskHandler = new ExampleTaskHandler();
    const taskHandlerProvider = new TaskHandlerProvider(uploadFileTaskHandler);
    const taskStateManager = new TaskStateManager();

    const taskRepository = new TaskRepository(configuration);
    this.taskCreator = new TaskCreator(taskRepository, configuration, kafkaFactory);

    this.messageHandler = new MessageHandler(taskHandlerProvider, taskStateManager)
    this.workerService = new WorkerService(kafkaFactory, this.messageHandler);
  }

  public static getWorkerService(workerId: string) {

    this.workerService.setWorkerId(workerId);
    this.messageHandler.setWorkerId(workerId);

    return this.workerService;
  }

  public static getTaskCreator() {
    return this.taskCreator;
  }
}