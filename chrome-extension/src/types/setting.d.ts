export type TimeUnit = "second" | "minute" | "hour";

export type NotificationSetting = {
  time: number;
  unit: TimeUnit;
  active: boolean;
};
