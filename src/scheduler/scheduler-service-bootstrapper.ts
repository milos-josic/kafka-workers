import { SchedulerService } from "./scheduler-service";
import { KafkaClientFactory } from "../worker/kafka/kafka-client-factory";
import { KafkaConfigurator } from "../worker/kafka/kafka-setup";
import { TaskRepository } from "../worker/tasks/task-repository";
import { TaskCreator } from "../worker/tasks/task-creator";
import { IWorkerServiceConfiguration } from "../worker/worker-service-configuration";


export class SchedulerBootstrapper{
    static schedulerService: SchedulerService;
    static kafkaConfigurator: KafkaConfigurator;
    static taskCreator: TaskCreator;

    public static async init(configuration: IWorkerServiceConfiguration) {

        if (!configuration) {
            throw new Error('Configuration cannot be null.')
          }


        let kafkaFactory = new KafkaClientFactory();

        this.kafkaConfigurator = new KafkaConfigurator(kafkaFactory);

        const taskRepository = new TaskRepository(configuration);
        await taskRepository.initDb();
        this.taskCreator = new TaskCreator(taskRepository, configuration, kafkaFactory);

        this.schedulerService = new SchedulerService(kafkaFactory, this.taskCreator);
    }

    static getSchedulerService() {
        return this.schedulerService;
    }

    static getKafkaConfigurator() {
        return this.kafkaConfigurator;
    }
}