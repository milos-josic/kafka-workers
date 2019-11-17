import { IKafkaClientFactory } from "./kafka-client-factory";
import { Environment } from "../../../environment";
import { TopicMetadata } from "./model/topic-metadata";

export class KafkaConfigurator {

    constructor(private kafkaFactory: IKafkaClientFactory) {
    }

    async configureKafka(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            //check if topic exists and if specified number of partitions exists there
            //if partiotion number is not there increase it..

            try {
                const admin = this.kafkaFactory.getAdmin();

                let metadata: TopicMetadata = await this.getKafkaMetadata(admin);

                if (!metadata.Exists) {
                    await this.createTopic(admin);
                } else if (metadata.NumberOfPartitions < Environment.getTopicPartitionNumber()) {
                    //partition number is less then desired one, we need to increase it...
                    await this.increasePartitionNumber(admin);
                }

                return resolve();
            } catch (error) {
                return reject(error);
            }
        })
    }

    increasePartitionNumber(admin: any) {
        // const client = this.kafkaFactory.getClient();

        // blizard library has this 
        // client.createPartitions(topicName, desiredPartitions, timeout, cb)

        //but I did not find any simillar in node-kafka one...
        // throw new Error("Method not implemented.");
    }

    createTopic(admin: any): Promise<any> {
        return new Promise((resolve, reject) => {
            var topics = [{
                topic: Environment.getTopicName(),
                partitions: Environment.getTopicPartitionNumber(),
                replicationFactor: Environment.getReplicationFactor()
            }];

            admin.createTopics(topics, (err, res) => {
                // result is an array of any errors if a given topic could not be created
                if (err) {
                    return reject(err)
                }

                return resolve(res);
            })
        })
    }

    private getKafkaMetadata(admin: any): Promise<TopicMetadata> {
        return new Promise((resolve, reject) => {
            admin.on('error', (err) => {
                return reject(err);
            })

            admin.listTopics((err, res) => {
                if (err) {
                    return reject(err)
                }

                console.log('topics', res);
                let topicMetadata = new TopicMetadata();

                if (res && res.length >= 2) {
                    const metadata = res[1];
                    const topicName = Environment.getTopicName();
                    if (metadata.metadata[topicName]) {
                        topicMetadata.Exists = true;
                        topicMetadata.NumberOfPartitions = Object.keys(metadata.metadata[topicName]).length;
                        return resolve(topicMetadata);
                    }
                }

                return resolve(topicMetadata);
            });
        })
    }
}