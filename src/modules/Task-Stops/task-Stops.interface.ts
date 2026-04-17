export type TaskStops = {
  order: number;
  locationLabel: string;
  locationLat: number;
  locationLng: number;
  address?: string;
  isCompleted?: boolean;
  taskId: string;
};

