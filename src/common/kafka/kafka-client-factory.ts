import { Environment } from "../../environment";
import { OffsetFetchRequest, ConsumerOptions, Consumer, KafkaClient, HighLevelProducer, ConsumerGroup, ConsumerGroupOptions, ProducerOptions } from "kafka-node";
var kafka = require('kafka-node');

const kafkaHost = Environment.getKafkaHost();
const topic = Environment.getTopicName();
const consumerGroupId = Environment.getConsumerGroupId();
const topics: OffsetFetchRequest[] = [{ topic: topic }];
const options: ConsumerOptions = {
    autoCommit: false,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    groupId: consumerGroupId
};

export interface IKafkaClientFactory{
    getClient(): KafkaClient;
    getConsumer(): Consumer;
    getProducer(): HighLevelProducer;
    getAdmin(): any;
    getConsumerGroup(): ConsumerGroup;
}

export class KafkaClientFactory implements IKafkaClientFactory{
    client: KafkaClient;
    consumer: Consumer;
    producer: HighLevelProducer;
    admin: any;
    consumerGroup: ConsumerGroup;
    constructor() {
        this.client = new KafkaClient({ kafkaHost });
        this.admin = new kafka.Admin(this.client);
    }

    public getClient(): KafkaClient {
        return this.client;
    }

    public getConsumer(): Consumer {
        if(!this.consumer){
            this.consumer = new Consumer(this.client, topics, options);
        }
        return this.consumer;
    }

    public getConsumerGroup(): ConsumerGroup {
        if(!this.consumerGroup){
            let options: ConsumerGroupOptions = {
                groupId: Environment.getConsumerGroupId(),
                autoCommit: false,
                kafkaHost: Environment.getKafkaHost(),
            }

            this.consumerGroup = new ConsumerGroup(options, Environment.getTopicName());
        }

        return this.consumerGroup;
    }

    public getProducer(): HighLevelProducer {
        if(!this.producer){
            //https://github.com/SOHU-Co/kafka-node/issues/1094
            let options: ProducerOptions = {
                requireAcks: 1,
                partitionerType: 2 //cyclic = 2,
            };
            this.producer = new HighLevelProducer(this.client, options);
        }

        return this.producer;
    }

    public getAdmin(): any {
        return this.admin;
    }
}