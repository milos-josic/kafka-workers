import { SchedulerBootstrapper } from "./scheduler/scheduler-service-bootstrapper";
import { Environment } from "./environment";

process.on('uncaughtException', function (err) {
  // Logger.logError(err);
  console.error(err);
  debugger;
  process.exit(1)
});

(async () => {

  console.log(`Scheduler Service Init. ${(new Date).toUTCString()}`);

  await SchedulerBootstrapper.init(new Environment());

  let schedulerService = SchedulerBootstrapper.getSchedulerService();
  let kafkaConfigurator = SchedulerBootstrapper.getKafkaConfigurator();

  // await kafkaConfigurator.configureKafka();

  await schedulerService.scheduleTasks();

  setInterval(async () => {
    await schedulerService.scheduleTasks();
  }, 30000);  //30000 = 30 seconds

  setInterval(async () => {
    await schedulerService.scheduleCleanUpTask();
  }, 600000);  //600000 = 10 minutes
})()