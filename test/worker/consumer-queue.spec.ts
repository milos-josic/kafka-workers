import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from "sinon";
import { ConsumerQueue } from '../../src/worker/consumer-queue';
import { IMessageHandler } from '../../src/worker/message-handler';
import { ConsumerGroup, Message } from 'kafka-node';



describe('worker/consumer-queue', function () {
    let consumerQueue: ConsumerQueue;
    let consumerGroup: ConsumerGroup;
    let consumerGroupStubbed: SinonStubbedInstance<ConsumerGroup> = sinon.createStubInstance(ConsumerGroup);
    let messageHandler: IMessageHandler;

    beforeEach(function () {
        console.log('before each worker service');
        messageHandler = {
            handle: sinon.stub()
        };     

        consumerQueue = new ConsumerQueue((consumerGroupStubbed as any) as ConsumerGroup, messageHandler);
    })

    describe('start', function () {

        it('on new message', async function () {

            let message: Message = {
                key: null,
                highWaterOffset: null,
                offset: 0,
                partition: 0,
                topic: 'test',
                value: ''
            }

            // (taskProvider.getNextTask as SinonStub).returns(task);
            // (taskHandlerProvider.getHandler as SinonStub).returns(taskHandler);

            consumerQueue.onNewMessage(message);

            sinon.assert.calledWith(consumerGroupStubbed.commit as SinonStub);
        })
    })
})