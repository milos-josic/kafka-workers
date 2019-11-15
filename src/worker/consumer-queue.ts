// import async = require("async");
// import { Environment } from "../environment";
// import { IMessageHandler } from "./message-handler";
// import { Consumer, Message } from "kafkajs";

// /**This class is based on implementation from this article:
//  * https://medium.com/walkme-engineering/managing-consumer-commits-and-back-pressure-with-node-js-and-kafka-in-production-cfd20c8120e3
//  */
// export class ConsumerQueue {
//     private readonly maxParallelHandles = 1;
//     private msgQueue: async.AsyncQueue<Message>;
//     private paused: boolean;

//     constructor(
//         private consumer: Consumer,
//         private messageHandler: IMessageHandler) {
//         this.init();
//     }

//     /**Called when Kafka Consumer receives a new message */
//     public onNewMessage(message: Message): void {
//         this.msgQueue.push(message);

//         if (this.msgQueue.length() >= this.maxParallelHandles) {
//             this.consumer.pause([{ topic: Environment.getTopicName()}]);
//             this.paused = true;
//         }
//     }

//     public async onRebalance(callback): Promise<void> {
//         console.log('on rebalance');
//         callback();      
//     }

//     private init() {
//         this.msgQueue = async.queue(async (message: Message, done) => {
//             try {
//                 await this.messageHandler.handle(message);
                
//                 this.consumer.commit(message, true, (err: Error, data: any) => {
//                     if (err) {
//                         console.log("CommitError %j", err);
//                         done(err)
//                     } else {
//                         console.log("CommitSuccess %j", message);
//                         done();
//                     }
//                 });              
//             } catch (error) {
//                 console.error(error);
//                 done(error);
//             }
//         }, this.maxParallelHandles);

//         this.msgQueue.drain(async () => {
//             console.log('async on drain');
//             if (this.paused) {
//                 this.consumer.resume([{ topic: Environment.getTopicName()}]);
//                 this.paused = false;
//             }
//         })
//     }
// }