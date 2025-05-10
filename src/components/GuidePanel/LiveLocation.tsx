// "use client"

// import React, { useEffect, useState, useRef } from "react"
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
// import { LatLngExpression, Icon } from "leaflet"
// import "leaflet/dist/leaflet.css"
// import { useSocket } from "@/providers/ClientSocketProvider"
// import { SessionData } from "@/utils/Types"
// import { useSession } from "next-auth/react"

// const LocationTrack: React.FC = () => {
//   const center: LatLngExpression = [27.7103, 85.3222]
//   const attribution: string =
//     '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

//   const customIcon = new Icon({
//     iconUrl: "/location-pin.png",
//     iconSize: [40, 40],
//   })

//   // State to track live user location
//   const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
//     null
//   )
//   const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
//   const [isSharing, setIsSharing] = useState<boolean>(true)
//   const { data: sessionData } = useSession()

//   // Get current user data
//   const user = sessionData as unknown as SessionData

//   // Refs to store interval ID and latest location
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)
//   const latestLocationRef = useRef<{
//     latitude: number
//     longitude: number
//   } | null>(null)

//   const { socket } = useSocket()

//   // Send location to server
//   const sendLocationToServer = () => {
//     if (socket && latestLocationRef.current && isSharing) {
//       socket.emit("guide-location", latestLocationRef.current)
//       console.log(
//         "Location sent at 60-second interval:",
//         latestLocationRef.current
//       )
//       setLastUpdateTime(new Date())
//     }
//   }

//   // Toggle location sharing
//   const toggleLocationSharing = () => {
//     if (isSharing) {
//       // Stop sharing
//       if (socket) {
//         socket.emit("guide-location-stopped")
//         console.log("Location sharing stopped")
//       }
//     } else {
//       // Resume sharing
//       if (latestLocationRef.current && socket) {
//         sendLocationToServer()
//       }
//     }
//     setIsSharing(!isSharing)
//   }

//   useEffect(() => {
//     if (!socket) return

//     // Set user role and name in socket query parameters
//     socket.io.opts.query = {
//       ...socket.io.opts.query,
//       userId: user.user.id || "unknown",
//       role: user.user.role || "Unknown",
//       name: user.user.name || "Unknown Guide",
//     }

//     // Reconnect with updated parameters
//     socket.disconnect().connect()
//   }, [socket, user])

//   useEffect(() => {
//     if (navigator.geolocation && isSharing) {
//       // Set up location watcher
//       const watcher = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords
//           setUserLocation([latitude, longitude])

//           // Store the latest location in ref for the interval to use
//           latestLocationRef.current = { latitude, longitude }
//         },
//         (error) => {
//           console.error("Error getting location:", error)
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 0,
//           timeout: 5000,
//         }
//       )

//       // Set up interval to send location every 60 seconds
//       if (intervalRef.current === null) {
//         // Initial location send
//         if (latestLocationRef.current && socket) {
//           sendLocationToServer()
//         }

//         // Set up recurring interval
//         intervalRef.current = setInterval(sendLocationToServer, 60000)
//       }

//       // Cleanup function
//       return () => {
//         // Clear interval when component unmounts
//         if (intervalRef.current !== null) {
//           clearInterval(intervalRef.current)
//           intervalRef.current = null
//         }

//         // Clear location watcher
//         navigator.geolocation.clearWatch(watcher)

//         // Notify server that we're stopping location sharing
//         if (socket && isSharing) {
//           socket.emit("guide-location-stopped")
//         }
//       }
//     } else if (!isSharing && intervalRef.current) {
//       // Clear interval when sharing is stopped
//       clearInterval(intervalRef.current)
//       intervalRef.current = null
//     }
//   }, [socket, isSharing]) // Re-run if socket or sharing status changes

//   // Format the last update time
//   const formatLastUpdateTime = () => {
//     if (!lastUpdateTime) return "Not yet sent"
//     return lastUpdateTime.toLocaleTimeString()
//   }

//   return (
//     <div className="h-full w-full relative">
//       <div className="absolute top-2 right-2 z-10 bg-white p-4 rounded shadow">
//         <p className="text-sm font-medium">
//           Status: {isSharing ? "Location sharing active" : "Sharing paused"}
//         </p>
//         <p className="text-xs text-gray-600">
//           Updates: {isSharing ? "Every 60 seconds" : "Paused"}
//         </p>
//         <p className="text-xs text-gray-600">
//           Last update: {formatLastUpdateTime()}
//         </p>
//         <button
//           onClick={toggleLocationSharing}
//           className={`mt-2 px-3 py-1 rounded text-white text-sm ${
//             isSharing
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {isSharing ? "Stop Sharing" : "Start Sharing"}
//         </button>
//       </div>

//       <MapContainer
//         center={userLocation || center}
//         zoom={14}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution={attribution}
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {userLocation && (
//           <Marker position={userLocation} icon={customIcon}>
//             <Popup>
//               <div>
//                 <p className="font-semibold">Your Current Location</p>
//                 <p className="text-xs text-gray-600">
//                   Last updated: {formatLastUpdateTime()}
//                 </p>
//               </div>
//             </Popup>
//           </Marker>
//         )}
//       </MapContainer>
//     </div>
//   )
// }

// export default LocationTrack
