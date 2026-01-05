"use client"

import { Truck, Clock, MapPin, Gift } from "lucide-react"

export default function ServiceInfo() {
  const getDeliveryTime = () => {
    const now = new Date()
    const hours = now.getHours()
    
    if (hours < 8) {
      return {
        time: "08:00 - 10:00",
        date: "Hôm nay"
      }
    } else if (hours < 14) {
      return {
        time: "14:00 - 16:00",
        date: "Hôm nay"
      }
    } else {
      return {
        time: "08:00 - 10:00",
        date: "Ngày mai"
      }
    }
  }

  const deliveryInfo = getDeliveryTime()

  const services = [
    {
      icon: Truck,
      title: "Miễn phí giao hàng",
      subtitle: "từ 300.000 VNĐ",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "Giao hàng nhanh 2H",
      subtitle: "",
      color: "text-green-500",
      showCircle: true
    },
    {
      icon: MapPin,
      title: "62 Tỉnh thành",
      subtitle: "",
      color: "text-green-500"
    },
    {
      icon: Gift,
      title: "Giá độc quyền",
      subtitle: "Hội viên FreshFarm",
      color: "text-red-500",
      showFF: true
    }
  ]

  return (
    <div className="w-full bg-gray-50 border-t-2 border-green-500 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Delivery Time - Top Right */}
        <div className="flex justify-end mb-6">
          <p className="text-sm text-gray-700">
            Đặt hàng ngay, đơn hàng sẽ đến lúc{" "}
            <span className="text-green-600 font-semibold">{deliveryInfo.time}</span>
            {", "}
            <span className="text-green-600 font-semibold">{deliveryInfo.date}</span>
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-3">
                  {service.showCircle ? (
                    // 2H Circle design
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 rounded-full border-4 border-green-300 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">2H</span>
                        </div>
                      </div>
                    </div>
                  ) : service.showFF ? (
                    // FFFF logo
                    <div className="w-50 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <text x="50" y="60" fontSize="32" fontWeight="bold" fill="#059669" textAnchor="middle">FreshFarm</text>
                      </svg>
                    </div>
                  ) : (
                    // Regular icon
                    <div className="w-24 h-24 flex items-center justify-center">
                      <Icon className={service.color} size={64} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                
                {/* Text */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {service.title}
                  </p>
                  {service.subtitle && (
                    <p className="text-xs text-gray-600">
                      {service.subtitle}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    
  )
}