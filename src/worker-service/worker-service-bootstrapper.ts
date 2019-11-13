import { WorkerService } from "./worker-service";
import { KafkaClientFactory } from "../common/kafka/kafka-client-factory";

export class WorkerServiceBootstrapper {
  static workerService: WorkerService;
  public static init(): void {
    const kafkaFactory = new KafkaClientFactory();

    this.workerService = new WorkerService(kafkaFactory);
  }

  public static getWorkerService(workerId: string) {
    this.workerService.setWorkerId(workerId);
    return this.workerService;
  }
}