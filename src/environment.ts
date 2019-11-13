export function isProductionMode(process: NodeJS.Process): boolean {
    return process.env.NODE_ENV === "production";
}

export function isTestMode(process: NodeJS.Process): boolean {
    return process.env.NODE_ENV === "test";
}

export function isDevelopmentMode(process: NodeJS.Process): boolean {
    return process.env.NODE_ENV === "development";
}

export function getPort(process?: NodeJS.Process): number {
    return parseInt((process && process.env.PORT) || "80", 10);
}

export function getGrpcPort(process?: NodeJS.Process): string {
    return (process && process.env.GRPCPORT) || "50000";
}

export class Environment{
    public static getTopicName(): string{
        return 'com.test.topic.name'
    }

    public static getTopicPartitionNumber(): number{
        return 6;
    }

    public static getReplicationFactor(): number{
        return 1;
    }

    public static getConsumerGroupId(): string{
        return 'acme-test-worker';
    }

    public static getKafkaHost(): string{
        return '127.0.0.1:9092';
    }
}
