import { Environment } from "../../environment";
const uuidv1 = require('uuid/v1');
// import { OffsetFetchRequest, ConsumerOptions, Consumer, KafkaClient, HighLevelProducer, ConsumerGroup, ConsumerGroupOptions, ProducerOptions, ConsumerGroupStream, ConsumerGroupStreamOptions, KafkaClientOptions } from "kafka-node";
// var kafka = require('kafka-node');
import { Kafka, KafkaConfig, Consumer, Producer, Admin, AdminConfig, ConsumerConfig, ProducerConfig, logLevel } from 'kafkajs'

export interface IKafkaClientFactory {
    getConsumer(): Consumer;
    getProducer(): Producer;
    getAdmin(): any;
}

export class KafkaClientFactory implements IKafkaClientFactory {
    client: Kafka;
    consumer: Consumer;
    producer: Producer;
    admin: Admin;
    clientId: string;
    constructor() {
        this.clientId = uuidv1();

        let options: KafkaConfig = {
            brokers: [Environment.getKafkaHost()],
            clientId: this.clientId,
            // logLevel: logLevel.DEBUG
        };

        this.client = new Kafka(options);

        const adminOptions: AdminConfig = {
            retry: {
                retries: 2,
            }
        };

        this.admin = this.client.admin(adminOptions);
    }

    public getConsumer(): Consumer {
        if (!this.consumer) {
            const options: ConsumerConfig = {
                groupId: Environment.getConsumerGroupId(),

            };

            this.consumer = this.client.consumer(options)

            //new Consumer(this.client, topics, options);
        }

        return this.consumer;
    }

    public getProducer(): Producer {
        if (!this.producer) {
            this.producer = this.client.producer();
        }

        return this.producer;
    }

    public getAdmin(): any {
        return this.admin;
    }
}