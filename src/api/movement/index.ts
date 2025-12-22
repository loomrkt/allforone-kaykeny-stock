import Movement from "@/interfaces/movement";
import {
  MovementInboundSchema,
  MovementOutBoundSchema,
} from "@/interfaces/movement/schema";
import { MvtStock } from "@/interfaces/stock";
import { axiosWithCredential, catchAndThrowAxios } from "@/lib/axios";
import z from "zod";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/stockMovement";

export type StockMovementDTO = Omit<MvtStock, "id">;

export type MovementInboundDTO = z.infer<typeof MovementInboundSchema>;

export type MovementOutBoundDTO = z.infer<typeof MovementOutBoundSchema>;

export const getMovementStocks = async (params: {
  search?: string;
  limit?: number;
  page?: number;
  type?: string; // "INBOUND" | "OUTBOUND"
  sourceId?: string;
  destinationId?: string;
  createdAt?: Date;
  email?: string;
}) => genericGetList<Movement>(url, { ...params });

export const getMovementStock = (id: string) =>
  genericGetOne<MvtStock>(url, id);

export const createMovementStock = (
  data: MovementInboundDTO[] | MovementOutBoundDTO[]
) => {
  const cleanedData = data.map((movement) => {
    const cleanedMovement = Object.fromEntries(
      Object.entries(movement).filter(([, value]) => value !== "")
    ) as MovementInboundDTO | MovementOutBoundDTO;
    return cleanedMovement;
  });

  return genericCreate<
    { movements: MovementInboundDTO[] | MovementOutBoundDTO[] },
    Movement
  >(url, {
    movements: cleanedData as MovementInboundDTO[] | MovementOutBoundDTO[],
  });
};

export const updateMovementStock = (id: string, data: StockMovementDTO) =>
  genericUpdate<StockMovementDTO, MvtStock>(url, id, data);

export const deleteMovementStock = (id: string | number) =>
  genericDelete(url, id);

export const getPieceCounter = () =>
  genericGetList<{ prefix: string; year: number; lastNumber: number }>(
    `${url}/piececounter`
  );

export const cancelStockMovement = async (movementId: string) => {
  try {
    const endpoint = `${url}/CancelMovement`;

    const response = await axiosWithCredential.post(endpoint, { movementId });

    return response.data;
  } catch (error) {
    console.error("Error in cancelStockMovement:", error);
    throw catchAndThrowAxios(error);
  }
};
