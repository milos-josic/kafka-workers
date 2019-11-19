import * as sinon from 'sinon';
import { SinonStub, SinonStubbedInstance } from "sinon";
import { expect } from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TaskRepository } from '../../../src/worker/tasks/task-repository';
import { Task } from '../../../src/worker/domain/task';



describe('tasks/task-repository', async () => {
    debugger;

    let taskRepository: TaskRepository;
    let mongod: MongoMemoryServer;
    before(async () => {

        mongod = new MongoMemoryServer();

        const connectionString = await mongod.getConnectionString();
        const port = await mongod.getPort();
        const dbPath = await mongod.getDbPath();
        const dbName = await mongod.getDbName();

        taskRepository = new TaskRepository({
            getExecutionCollectionName: () => { return 'executionlist' },
            getMongoConnectionString: () => { return connectionString },
            getRetryPolicy: null,
            getTasksCollectionName: () => 'tasks',
            getTasksDbName: () => 'tasks',
            getTopicName: null
        })

        await taskRepository.initDb();
    });


    it('insert many tasks', async () => {
        let tasks: Task[] = [];
        tasks.push({
            _id: null,
            Data: JSON.stringify({}),
            TaskType: 'Something1',
            TenantId: '2323'
        })

        tasks.push({
            _id: null,
            Data: JSON.stringify({}),
            TaskType: 'Something2',
            TenantId: '2323'
        })

        debugger;

        let savedTasks = await taskRepository.insertManyTasks(tasks);

        expect(savedTasks).length(2);

         savedTasks.forEach(task => {
             expect(task._id).exist;
         })
    })

    it('insert one task', async () => {

        let taskId = await taskRepository.insertTask({
            _id: null,
            Data: JSON.stringify({}),
            TaskType: 'Something1',
            TenantId: '2323'
        });

        expect(taskId).exist;
    })

    after(async () => {
        await mongod.stop();
    })
})