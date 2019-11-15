// import * as sinon from 'sinon';
// import { SinonStub, SinonStubbedInstance } from "sinon";
// import { ConsumerQueue } from '../../src/worker/consumer-queue';
// import { IMessageHandler } from '../../src/worker/message-handler';
// import { ConsumerGroup, Message, ConsumerGroupStream } from 'kafka-node';



// describe('worker/consumer-queue', function () {
//     let consumerQueue: ConsumerQueue;
//     let consumerGroup: ConsumerGroup;
//     let consumerGroupStubbed: SinonStubbedInstance<ConsumerGroupStream> = sinon.createStubInstance(ConsumerGroupStream);
//     let messageHandler: IMessageHandler;

//     beforeEach(function () {
//         console.log('set up stubs');
//         messageHandler = {
//             handle: sinon.stub()
//         };

//         consumerQueue = new ConsumerQueue((consumerGroupStubbed as any) as ConsumerGroupStream, messageHandler);
//     })

//     describe('start', function () {

//         it('on new message', async function () {
//             debugger;
//             let message: Message = {
//                 key: null,
//                 highWaterOffset: null,
//                 offset: 0,
//                 partition: 0,
//                 topic: 'test',
//                 value: ''
//             }

//             // (taskProvider.getNextTask as SinonStub).returns(task);
//             // (taskHandlerProvider.getHandler as SinonStub).returns(taskHandler);

//             consumerQueue.onNewMessage(message);

//             /** Assert is done in setTimeout because async library will not call registered function before */
//             setTimeout(() => {
//                 sinon.assert.calledOnce(consumerGroupStubbed.commit as SinonStub);
//             }, 1000);
//         })
//     })
// })