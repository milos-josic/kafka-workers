import { SchedulerBootstrapper } from "./scheduler/scheduler-service-bootstrapper";
import { WorkerService } from "./worker-service/worker-service";
import { WorkerServiceBootstrapper } from "./worker-service/worker-service-bootstrapper";

process.on('uncaughtException', function (err) {
    // Logger.logError(err);   
    
    process.exit(1)
  });
    
  (async () => {
    
      const workerId: string = process.env.pm_id || '0';

      console.log(`Worker Service Init. ${(new Date).toUTCString()}`);
  
      WorkerServiceBootstrapper.init();
  
      let workerService = WorkerServiceBootstrapper.getWorkerService(workerId);
      
      workerService.start(); 
  })()