import { endpointBE } from "../layout/utils/Constant";
import DeliveryModel from "../model/DeliveryModel";
import { my_request } from "./Request";

export async function getDeliveryById(idDelivery) {
    const endPoint = endpointBE + `/deliveries/${idDelivery}`;
    const response = await my_request(endPoint);
    const data = response.data || response;
    const delivery = new DeliveryModel(
        data.idDelivery,
        data.nameDelivery,
        data.feeDelivery
    );
    return delivery;
}
