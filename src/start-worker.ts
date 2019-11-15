import { SchedulerBootstrapper } from "./scheduler/scheduler-service-bootstrapper";
import { WorkerService } from "./worker/worker-service";
import { WorkerServiceBootstrapper } from "./worker/worker-service-bootstrapper";

process.on('uncaughtException', function (err) {
    // Logger.logError(err);   
    
    process.exit(1)
  });
    
  (async () => {
    
      const workerId: string = process.env.pm_id || '0';

      console.log(`Worker Service Init. ${(new Date).toUTCString()}`);
  
      WorkerServiceBootstrapper.init();
  
      let workerService = WorkerServiceBootstrapper.getWorkerService(workerId);
      
      await workerService.start(); 
  })()