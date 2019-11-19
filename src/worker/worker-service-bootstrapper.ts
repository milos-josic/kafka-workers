import { WorkerService } from "./worker-service";
import { KafkaClientFactory } from "./kafka/kafka-client-factory";
import { MessageHandler } from "./message-handler";
import { ExampleTaskHandler } from "./handlers/upload-file-task-handler";
import { TaskStateManager } from "./tasks/task-state-manager";
import { TaskRepository } from "./tasks/task-repository";
import { TaskCreator } from "./tasks/task-creator";
import { IWorkerServiceConfiguration } from "./worker-service-configuration";
import { ITaskHandlerProvider } from "./tasks/task-handler-provider";

export class WorkerServiceBootstrapper {
  private static workerService: WorkerService;
  private static messageHandler: MessageHandler;
  static taskCreator: TaskCreator;

  public static async init(
    configuration: IWorkerServiceConfiguration,
    taskHandlerProvider: ITaskHandlerProvider): Promise<any> {

    if (!configuration || !taskHandlerProvider) {
      throw new Error('Configuration and taskHandlerProvider cannot be null.')
    }

    const kafkaFactory = new KafkaClientFactory();
    const taskRepository = new TaskRepository(configuration);
    await taskRepository.initDb();
    this.taskCreator = new TaskCreator(taskRepository, configuration, kafkaFactory);

    const taskStateManager = new TaskStateManager(taskRepository, configuration);
    this.messageHandler = new MessageHandler(taskHandlerProvider, taskStateManager)
    this.workerService = new WorkerService(kafkaFactory, this.messageHandler, this.taskCreator);
  }

  public static async initTaskCreator(configuration: IWorkerServiceConfiguration) {
    const kafkaFactory = new KafkaClientFactory();
    const taskRepository = new TaskRepository(configuration);
    await taskRepository.initDb();

    this.taskCreator = new TaskCreator(taskRepository, configuration, kafkaFactory);
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