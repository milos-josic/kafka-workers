import { Environment } from "../../environment";
const uuidv1 = require('uuid/v1');
import { OffsetFetchRequest, ConsumerOptions, Consumer, KafkaClient, HighLevelProducer, ConsumerGroup, ConsumerGroupOptions, ProducerOptions, ConsumerGroupStream, ConsumerGroupStreamOptions, KafkaClientOptions } from "kafka-node";
var kafka = require('kafka-node');

const kafkaHost = Environment.getKafkaHost();
const topic = Environment.getTopicName();
const consumerGroupId = Environment.getConsumerGroupId();
const topics: OffsetFetchRequest[] = [{ topic: topic }];
const options: ConsumerOptions = {
    autoCommit: false,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    groupId: consumerGroupId,
};

export interface IKafkaClientFactory {
    getClient(): KafkaClient;
    getConsumer(): Consumer;
    getProducer(): HighLevelProducer;
    getAdmin(): any;
    getConsumerGroup(): ConsumerGroupStream;
}

export class KafkaClientFactory implements IKafkaClientFactory {
    client: KafkaClient;
    consumer: Consumer;
    producer: HighLevelProducer;
    admin: any;
    consumerGroup: ConsumerGroupStream;
    constructor() {
        let options: KafkaClientOptions = {
            kafkaHost: kafkaHost,
            autoConnect: true,
        };

        this.client = new KafkaClient(options);
        this.admin = new kafka.Admin(this.client);
    }

    public getClient(): KafkaClient {
        return this.client;
    }

    public getConsumer(): Consumer {
        if (!this.consumer) {
            this.consumer = new Consumer(this.client, topics, options);
        }

        this.consumer.commit

        return this.consumer;
    }

    public getConsumerGroup(): ConsumerGroupStream {
        if (!this.consumerGroup) {
            let options: ConsumerGroupStreamOptions = {
                id: uuidv1(),
                groupId: Environment.getConsumerGroupId(),
                autoCommit: false,
                kafkaHost: Environment.getKafkaHost(),
                sessionTimeout: 15000,
                encoding: 'buffer',
                keyEncoding: 'buffer',
            }

            console.log(`created consumer with id ${options.id}`);

            this.consumerGroup = new ConsumerGroupStream(options, Environment.getTopicName());
        }

        return this.consumerGroup;
    }

    public getProducer(): HighLevelProducer {
        if (!this.producer) {
            //https://github.com/SOHU-Co/kafka-node/issues/1094
            let options: ProducerOptions = {
                requireAcks: 1,
                partitionerType: 2, //cyclic = 2,
            };
            this.producer = new HighLevelProducer(this.client, options);
        }

        return this.producer;
    }

    public getAdmin(): any {
        return this.admin;
    }
}