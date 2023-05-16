import ViewOrders from "./ViewOrders"
import ViewToReceive from "./ViewToReceive"
import ViewDelivered from "./ViewDelivered"

const ViewMyOrders = () => {
  return (
    <div>
        <ViewOrders />
        <ViewToReceive />
        <ViewDelivered />
    </div>
  )
}

export default ViewMyOrders