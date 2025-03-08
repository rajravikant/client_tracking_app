import { useState } from "react"
import { Box, 
    ChevronDown,
    ChevronUp, MessageSquare, Phone, 
    } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../store";


const ShipmentsSideBar = () => {
    const shipments = useSelector((state: RootState) => state.shipments.shipments);
    const [selectedShipment, setSelectedShipment] = useState<string>()
    const [expandedShipment, setExpandedShipment] = useState<string>()
  
    const toggleShipmentExpand = (id: string) => {
      if (expandedShipment === id) {
        setExpandedShipment("")
      } else {
        setExpandedShipment(id)
        setSelectedShipment(id)
      }
    }

    
    
  return (
    <div className="space-y-4">
    {shipments.map((shipment) => (
        <div
          key={shipment._id}
          className={`border ${expandedShipment === shipment._id ? "border-teal-500" : "border-gray-200"} rounded-lg overflow-hidden`}
        >
          <div
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleShipmentExpand(shipment._id!)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${shipment.status === "In Transit" ? "bg-teal-50 text-teal-600" : "bg-gray-100"}`}
              >
                <Box className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Shipping ID</div>
                <div className="font-medium">#{shipment._id}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full px-3 py-1 text-sm border  ${
                  shipment.status === "Delivered"
                    ? "bg-green-100 text-green-800 border-green-800 hover:bg-green-100"
                    : shipment.status === "In Transit"
                      ? "bg-blue-100 text-blue-800 border-blue-800 hover:bg-blue-100"
                      : "bg-yellow-100 text-yellow-800 border-yellow-800 hover:bg-yellow-100"
                }`}
              >
                {shipment.status}
              </div>
              {expandedShipment === shipment._id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>

          {expandedShipment === shipment._id  && shipment.route.length > 0 && (
            <div className="px-4 pb-4">
              <div className="border-l-2 border-gray-200 ml-6 pl-6 space-y-6">
                {shipment.route.map((rt, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute -left-[33px] top-1 w-5 h-5 rounded-full border-4 ${true ? "border-teal-500 bg-white" : "border-gray-200 bg-gray-200"}`}
                    ></div>
                    <div className="text-sm text-gray-500">{new Date().toDateString()}</div>
                    <div className="text-sm">{rt.coordinates[1]} | {rt.coordinates[0]}</div>
                  </div>
                ))}
              </div>

              {(
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                    <img src="https://avatar.iran.liara.run/public/16" className="size-[40px] object-cover" alt="User" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500"> {shipment.vehicleDetails.vehicleNumber} | {shipment.vehicleDetails.vehicleType}</div>
                      <div className="font-medium">{shipment.assignedDriver}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-full h-10 w-10 border-teal-500 text-teal-500"
                    >
                      <Phone className="h-5 w-5" />
                    </button>
                    <button
                      className="rounded-full h-10 w-10 border-teal-500 text-teal-500"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      </div>
  )
}

export default ShipmentsSideBar