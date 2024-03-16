import { User } from "./auth";
import { ProjectOffer } from "./project";
import { Service } from "./service";

export interface Checkout {
  id: string;
  userId: number | null;
  offerId: number | null;
  serviceId: number | null;
  amount: number;
  user?: User | null;
  offer: ProjectOffer | null;
  service: Service | null;
  status: "PREDEFINED" | "PENDING" | "WAITING_FOR_CAPTURE" | "PAID" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}
