import { SchedulerService } from "./scheduler-service";
import { KafkaClientFactory } from "../common/kafka/kafka-client-factory";
import { KafkaConfigurator } from "../common/kafka/kafka-setup";


export class SchedulerBootstrapper{
    static schedulerService: SchedulerService;
    static kafkaConfigurator: KafkaConfigurator;

    static init() {
        let kafkaFactory = new KafkaClientFactory();

        this.kafkaConfigurator = new KafkaConfigurator(kafkaFactory);
        this.schedulerService = new SchedulerService(kafkaFactory);
    }

    static getSchedulerService() {
        return this.schedulerService;
    }

    static getKafkaConfigurator() {
        return this.kafkaConfigurator;
    }
}