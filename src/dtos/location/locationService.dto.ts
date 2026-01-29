export class AddLocationServicePayload {
  locationCode: string;
  data: LocationServiceData[];
}

export class LocationServiceData {
  serviceCode: string;
  isActive: boolean;
  note?: string;
}

export class LocationServiceResponse {
  message: string;
}
