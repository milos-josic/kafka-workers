import { KafkaClient as Client, Consumer, Message, Offset, OffsetFetchRequest, ConsumerOptions } from 'kafka-node';
import { Environment } from '../environment';
import { IKafkaClientFactory } from '../common/kafka/kafka-client-factory';
import { Task } from '../common/domain/task';

export class WorkerService {
  private workerId: string;

  constructor(private kafkaFactory: IKafkaClientFactory) {
  }

  start(): void {
    // https://gist.githubusercontent.com/drochgenius/485cdb9e022618276be241a9a7247e5e/raw/c6a228588135e77ba5316e884b78a1d47a5b6fe9/consumer.ts

    const consumerGroup = this.kafkaFactory.getConsumerGroup();

    consumerGroup.on('error', function (err: Error): void {
      console.log('consumerGroup on error:')
      console.error(err)
    });

    consumerGroup.on('message', async (message: Message) => {
      let data: string = message.value.toString();

      console.log(`Worker ${this.workerId} has received from kafka %j`, message);

      let task = JSON.parse(data) as Task;

      let result = await this.handleMessage(task)

      console.log('Worker has finished handling task %j', task);

      consumerGroup.sendOffsetCommitRequest([{
        topic: message.topic,
        partition: message.partition, //default 0
        offset: message.offset,
        metadata: 'm', //default 'm'
      }], (err, data) => {
        if (err) {
          console.log("sendOffsetCommitRequest successfully committed. Offset: " + message.offset);
        } else {
          console.log("sendOffsetCommitRequest err: " + err);
        }
      });
    })
  }

  handleMessage(task: Task) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve()
      }, 1000);
    })
  }

  setWorkerId(workerId: string) {
    this.workerId = workerId;
  }
}