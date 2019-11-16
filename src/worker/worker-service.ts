import { KafkaClient as Client, Consumer, Message, Offset, OffsetFetchRequest, ConsumerOptions } from 'kafka-node';
import { Environment } from '../environment';
import { IKafkaClientFactory } from '../common/kafka/kafka-client-factory';
import { Task } from '../common/domain/task';
import { IMessageHandler, MessageHandleResponse } from './message-handler';
import { Offsets, EachBatchPayload, OffsetsByTopicPartition, RecordMetadata } from 'kafkajs';

export class WorkerService {
  private workerId: string;
  producer: any;
  consumer: any;
  private tempI: number = 0;
  constructor(
    private kafkaFactory: IKafkaClientFactory,
    private messageHandler: IMessageHandler) {
  }

  public setWorkerId(workerId: string) {
    this.workerId = workerId;
  }

  async start(): Promise<void> {
    this.producer = this.kafkaFactory.getProducer();
    this.consumer = this.kafkaFactory.getConsumer();

    await this.consumer.connect()
    await this.consumer.subscribe({ topic: Environment.getTopicName(), fromBeginning: true })

    this.consumer.run({
      autoCommit: false,
      eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale, commitOffsetsIfNecessary, uncommittedOffsets }) => {
        this.tempI++;
        console.log(`batch started ${this.tempI}`);
        debugger;
        let uncommited: OffsetsByTopicPartition = await uncommittedOffsets();
        let offsets: Offsets = {
          topics: []
        };

        let intervalId = setInterval(async () => {
          console.log('heartbeat called')
          await heartbeat()
        }, 1000);

        let processMessagePromises = [];

        for (let message of batch.messages) {
          if (!isRunning() || isStale()) {
            break;
          }

          offsets.topics.push({ topic: Environment.getTopicName(), partitions: [{ partition: batch.partition, offset: message.offset }] })

          processMessagePromises.push(this.ProcessMessage(message, batch));
        }

        try {
          await Promise.all(processMessagePromises);
        } catch (error) {
          console.error(error);
        }
        finally {
          clearInterval(intervalId);
        }

        await commitOffsetsIfNecessary(offsets);

        console.log(`batch finished ${this.tempI}`);
      }
    });
  }

  /**
   * Message will be processed by IMassageHandler
   * It will be stored again on Kafka in case message handler tells it so.
   */
  private async ProcessMessage(message, batch): Promise<any> {
    let response: MessageHandleResponse =
      await this.messageHandler.handle(message, batch.partition);

    if (response.placeBackMessageOnKafka) {
      let metadata: RecordMetadata[] = await this.producer.send({
        topic: Environment.getTopicName(),
        messages: [{ value: message.value.toString() }]
      })

      console.log('Message has been placed again on Kafka.')
      console.log(metadata);
    }
  }
}