import { SchedulerBootstrapper } from "./scheduler/scheduler-service-bootstrapper";
import { WorkerService } from "./worker/worker-service";
import { WorkerServiceBootstrapper } from "./worker/worker-service-bootstrapper";
import { Environment } from "./environment";
import { ExampleTaskHandler } from "./worker/handlers/upload-file-task-handler";
import { ExampleTaskHandlerProvider } from "./client/example-task-handler-provider";

process.on('uncaughtException', function (err) {
    // Logger.logError(err);   
    
    process.exit(1)
  });
    
  (async () => {
    
      const workerId: string = process.env.pm_id || '0';

      console.log(`Worker Service Init. ${(new Date).toUTCString()}`);
  
      let taskHandlerProvider = new ExampleTaskHandlerProvider(new ExampleTaskHandler());

      let configuration = new Environment();

      await WorkerServiceBootstrapper.init(configuration, taskHandlerProvider);
  
      let workerService = WorkerServiceBootstrapper.getWorkerService(workerId);
      
      await workerService.start(); 
  })()