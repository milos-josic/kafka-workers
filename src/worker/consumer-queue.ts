import { ConsumerGroup, Message } from "kafka-node";
import async = require("async");
import { Environment } from "../environment";
import { IMessageHandler } from "./message-handler";

/**This class is based on implementation from this article:
 * https://medium.com/walkme-engineering/managing-consumer-commits-and-back-pressure-with-node-js-and-kafka-in-production-cfd20c8120e3
 */
export class ConsumerQueue {
    private readonly maxParallelHandles = 1;
    private msgQueue: async.AsyncQueue<Message>;
    private paused: boolean;

    constructor(
        private consumerGroup: ConsumerGroup,
        private messageHandler: IMessageHandler) {
        this.init();
    }

    /**Called when Kafka Consumer receives a new message */
    public onNewMessage(message: Message): void {
        this.msgQueue.push(message);

        if (this.msgQueue.length() >= this.maxParallelHandles) {
            this.consumerGroup.pause();
            this.paused = true;
        }
    }

    public async onRebalance(): Promise<void> {

        console.log('on rebalance');

        // if (err.code === kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {
        //     this.consumerGroup.assign(assignments);
        // } else if (err.code === kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
        //     if (this.paused) {
        //         this.consumerGroup.resume(assignments);
        //         this.paused = false;
        //     }

        //     this.msgQueue.remove((d, p) => { return true; });
        //     this.consumerGroup.unassign();
        // } else {
        //     console.error(`Rebalace error : ${err}`);
        // }
    }

    private init() {
        this.msgQueue = async.queue(async (message: Message, done) => {
            try {
                await this.messageHandler.handle(message);

                this.consumerGroup.sendOffsetCommitRequest([{
                    topic: message.topic,
                    partition: message.partition, //default 0
                    offset: message.offset,
                    metadata: 'm', //default 'm'
                }], (err, data) => {
                    if (err) {
                        console.log("sendOffsetCommitRequest err: " + err);
                        return done(err);
                    } else {
                        console.log("sendOffsetCommitRequest successfully committed. Offset: " + message.offset);
                        return done();
                    }
                });
            } catch (error) {
                console.error(error);
                done(error);
            }
        }, this.maxParallelHandles);

        this.msgQueue.drain(async () => {
            if (this.paused) {
                this.consumerGroup.resume();
                this.paused = false;
            }
        })
    }
}