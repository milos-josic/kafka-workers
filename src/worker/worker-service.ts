import { KafkaClient as Client, Consumer, Message, Offset, OffsetFetchRequest, ConsumerOptions } from 'kafka-node';
import { Environment } from '../environment';
import { IKafkaClientFactory } from '../common/kafka/kafka-client-factory';
import { Task } from '../common/domain/task';
import { ConsumerQueue } from './consumer-queue';
import { IMessageHandler } from './message-handler';

export class WorkerService {
  private workerId: string;

  constructor(
    private kafkaFactory: IKafkaClientFactory,
    private messageHandler: IMessageHandler) {
  }

  start(): void {
    // https://gist.githubusercontent.com/drochgenius/485cdb9e022618276be241a9a7247e5e/raw/c6a228588135e77ba5316e884b78a1d47a5b6fe9/consumer.ts

    const consumerGroup = this.kafkaFactory.getConsumerGroup();

    consumerGroup.on('error', function (err: Error): void {
      console.log('consumerGroup on error:')
      console.error(err)
    });
    
    const queue = new ConsumerQueue(consumerGroup, this.messageHandler);

    consumerGroup.on('message', queue.onNewMessage);

    consumerGroup.on('rebalancing', queue.onRebalance);
  }

  setWorkerId(workerId: string) {
    this.workerId = workerId;
  }
}