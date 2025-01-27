// SocketComponent.js
import {
  getForex,
  getMetals,
  getOils,
  getStocks,
} from "@/store/action/forexactions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

const SocketComponent = () => {
  // dispatch
  const dispatch = useDispatch();

  // Forex DATA
  // useEffect(() => {
  //   // Connect to the WebSocket server
  //   const socket = io("https://wss3.live-rates.com/", {
  //     transports: ["websocket"],
  //   });

  //   // Use the 'trial' as a key to establish a 2-minute streaming connection with real-time data.
  //   // After the 2-minute test, the server will drop the connection and block the IP for an Hour.
  //   const key = "trial";

  //   socket.on("connect", () => {
  //     // If you want to subscribe only to specific instruments, emit instruments.
  //     // To receive all instruments, comment the line below.
  //     const instruments = [
  //       "EURUSD",
  //       "EURCAD",
  //       "EURJPY",
  //       "EURGBP",
  //       "EURAUD",
  //       "EURNZD",
  //       "EURCHF",
  //       "GBPJPY",
  //       "GBPUSD",
  //       "GBPCHF",
  //       "GBPAUD",
  //       "GBPCAD",
  //       "GBPNZD",
  //       "AUDUSD",
  //       "AUDJPY",
  //       "AUDCAD",
  //       "AUDNZD",
  //       "USDJPY",
  //       "USDCAD",
  //       "USDCHF",
  //     ];
  //     socket.emit("instruments", instruments);

  //     socket.emit("key", key);
  //   });

  //   socket.on("rates", (msg) => {
  //     // Do what you want with the incoming rates... Enjoy!
  //     try {
  //       const obj = JSON.parse(msg);
  //       console.log("socket ===>", obj);

  //       dispatch(getForex(obj));
  //       // Update your component state or perform other actions with the received data
  //     } catch (e) {
  //       console.log(msg);
  //     }
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // Stock DATA
  // useEffect(() => {
  //   // Connect to the WebSocket server
  //   const socket = io("https://wss3.live-rates.com/", {
  //     transports: ["websocket"],
  //   });

  //   // Use the 'trial' as a key to establish a 2-minute streaming connection with real-time data.
  //   // After the 2-minute test, the server will drop the connection and block the IP for an Hour.
  //   const key = "trial";

  //   socket.on("connect", () => {
  //     // If you want to subscribe only to specific instruments, emit instruments.
  //     // To receive all instruments, comment the line below.
  //     const instruments = [
  //       "#FACEBOOK",
  //       "#AMAZON",
  //       "#GOOGLE",
  //       "#TESLA",
  //       "#APPLE",
  //     ];
  //     socket.emit("instruments", instruments);

  //     socket.emit("key", key);
  //   });

  //   socket.on("rates", (msg) => {
  //     // Do what you want with the incoming rates... Enjoy!
  //     try {
  //       const obj = JSON.parse(msg);
  //       dispatch(getStocks(obj));

  //       // Update your component state or perform other actions with the received data
  //     } catch (e) {
  //       console.log(msg);
  //     }
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // Metals DATA
  // useEffect(() => {
  //   // Connect to the WebSocket server
  //   const socket = io("https://wss3.live-rates.com/", {
  //     transports: ["websocket"],
  //   });

  //   // Use the 'trial' as a key to establish a 2-minute streaming connection with real-time data.
  //   // After the 2-minute test, the server will drop the connection and block the IP for an Hour.
  //   const key = "trial";

  //   socket.on("connect", () => {
  //     // If you want to subscribe only to specific instruments, emit instruments.
  //     // To receive all instruments, comment the line below.
  //     const instruments = ["GOLD", "PLATINUM", "SILVER", "Copper"];
  //     socket.emit("instruments", instruments);

  //     socket.emit("key", key);
  //   });

  //   socket.on("rates", (msg) => {
  //     // Do what you want with the incoming rates... Enjoy!
  //     try {
  //       const obj = JSON.parse(msg);
  //       dispatch(getMetals(obj));
  //       // Update your component state or perform other actions with the received data
  //     } catch (e) {
  //       console.log(msg);
  //     }
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // Oils DATA
  // useEffect(() => {
  //   // Connect to the WebSocket server
  //   const socket = io("https://wss3.live-rates.com/", {
  //     transports: ["websocket"],
  //   });

  //   // Use the 'trial' as a key to establish a 2-minute streaming connection with real-time data.
  //   // After the 2-minute test, the server will drop the connection and block the IP for an Hour.
  //   const key = "trial";

  //   socket.on("connect", () => {
  //     // If you want to subscribe only to specific instruments, emit instruments.
  //     // To receive all instruments, comment the line below.
  //     const instruments = ["HEATING_OIL", "GASOLINE"];
  //     socket.emit("instruments", instruments);

  //     socket.emit("key", key);
  //   });

  //   socket.on("rates", (msg) => {
  //     // Do what you want with the incoming rates... Enjoy!
  //     try {
  //       const obj = JSON.parse(msg);
  //       dispatch(getOils(obj));
  //       // Update your component state or perform other actions with the received data
  //     } catch (e) {
  //       console.log(msg);
  //     }
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return <div>{/* Your component JSX */}</div>;
};

export default SocketComponent;
