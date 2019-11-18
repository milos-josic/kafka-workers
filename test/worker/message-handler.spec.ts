import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from "sinon";
import { ITaskStateManager } from '../../src/worker/tasks/task-state-manager';
import { ITaskHandler } from '../../src/worker/tasks/task-handler';
import { KafkaMessage } from 'kafkajs';
import { Task } from '../../src/worker/domain/task';
import { IMessageHandler, MessageHandler } from '../../src/worker/message-handler';
import { ITaskHandlerProvider } from '../../src/worker/tasks/task-handler-provider';

describe('worker/message-handler', () => {
    let messageHandler: IMessageHandler;
    let taskHandlerProvider: ITaskHandlerProvider;
    let taskStateManager: ITaskStateManager;
    let taskHandler: ITaskHandler;

    beforeEach(function () {
        taskHandler = {
            handle: sinon.stub().resolves()
        }

        taskHandlerProvider = {
            getHandler: (task) => {
                return taskHandler
            }
        };

        taskStateManager = {
            setTaskFailed: sinon.stub(),
            setTaskFinished: sinon.stub().resolves()
        }

        messageHandler = new MessageHandler(taskHandlerProvider, taskStateManager);
    });

    it('finish task successfully', async () => {
        let partition = 0;

        let task = new Task();
        task.TaskType = 'Something';
        task._id = '3213';

        let message: KafkaMessage = {
            value:  Buffer.from(JSON.stringify(task), 'UTF-8'),
            timestamp: null,
            attributes: null,
            headers: null,
            key: null,
            offset: null,
            size: null
        }

        debugger;

        await messageHandler.handle(message, partition);

        sinon.assert.calledOnce(taskHandler.handle as sinon.SinonStub);

        sinon.assert.calledOnce(taskStateManager.setTaskFinished as sinon.SinonStub);

        sinon.assert.calledWithMatch(
            taskStateManager.setTaskFinished as sinon.SinonStub,
            {
              task:task 
            });            
    })
})