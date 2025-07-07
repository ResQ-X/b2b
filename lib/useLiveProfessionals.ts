/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";

// interface RawProfessional {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   is_online: boolean;
//   userType: string;
//   [key: string]: any;
// }

// interface AllProfessionalResponse {
//   professionals: RawProfessional[];
//   firstResponders: RawProfessional[];
// }

// export function useLiveProfessionals(userId: string | undefined) {
//   const [allProfessionalsData, setAllProfessionalsData] = useState<
//     RawProfessional[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!userId) return;

//     const socket = io("https://internal-backend-rdhj.onrender.com", {
//       query: { userId },
//       transports: ["websocket"],
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       console.log("Socket connected");
//     });

//     socket.on("AllProfessionalDetails", (data: AllProfessionalResponse) => {
//       if (
//         !Array.isArray(data.professionals) ||
//         !Array.isArray(data.firstResponders)
//       )
//         return;

//       const allData: RawProfessional[] = [
//         ...data.professionals,
//         ...data.firstResponders,
//       ];

//       const filtered = allData
//         .filter((pro) => pro.latitude && pro.longitude)
//         .map((pro) => ({
//           ...pro,
//           latitude: pro.latitude!,
//           longitude: pro.longitude!,
//         }));
//       setAllProfessionalsData(filtered);
//       setLoading(false);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected");
//     });

//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [userId]);

//   return { allProfessionalsData, loading };
// }

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface RawProfessional {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  is_online: boolean;
  userType: string;
  service?: string;
  status?: string;
  location?: string;
  [key: string]: any;
}

interface Professional extends RawProfessional {
  professionalType: "PROFESSIONAL_TOW_TRUCK" | "PROFESSIONAL_FIRST_RESPONDDER";
}

interface AllProfessionalResponse {
  professionals: RawProfessional[];
  firstResponders: RawProfessional[];
}

export function useLiveProfessionals(userId: string | undefined) {
  const [allProfessionalsData, setAllProfessionalsData] = useState<
    Professional[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const socket = io("https://internal-backend-rdhj.onrender.com", {
      query: { userId },
      transports: ["websocket"],
      timeout: 10000, // 10 second timeout
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setError(null);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to server");
      setLoading(false);
    });

    socket.on("AllProfessionalDetails", (data: AllProfessionalResponse) => {
      try {
        if (
          !data ||
          !Array.isArray(data.professionals) ||
          !Array.isArray(data.firstResponders)
        ) {
          console.error("Invalid data format received:", data);
          setError("Invalid data format received");
          setLoading(false);
          return;
        }

        // Helper function to validate and convert coordinates
        const isValidCoordinate = (value: any): boolean => {
          const num = Number(value);
          return (
            !isNaN(num) && isFinite(num) && num !== null && num !== undefined
          );
        };

        const validateAndConvertCoordinates = (pro: RawProfessional) => {
          const lat = Number(pro.latitude);
          const lng = Number(pro.longitude);

          return {
            isValid:
              isValidCoordinate(pro.latitude) &&
              isValidCoordinate(pro.longitude),
            latitude: lat,
            longitude: lng,
          };
        };

        // Map professionals with their type
        const mappedProfessionals: Professional[] = data.professionals
          .map((pro) => {
            const coords = validateAndConvertCoordinates(pro);
            return {
              ...pro,
              professionalType: "PROFESSIONAL_TOW_TRUCK" as const,
              latitude: coords.latitude,
              longitude: coords.longitude,
              isValidCoordinates: coords.isValid,
            };
          })
          .filter((pro) => pro.isValidCoordinates)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ isValidCoordinates, ...pro }) => pro);

        // Map first responders with their type
        const mappedFirstResponders: Professional[] = data.firstResponders
          .map((pro) => {
            const coords = validateAndConvertCoordinates(pro);
            return {
              ...pro,
              professionalType: "PROFESSIONAL_FIRST_RESPONDDER" as const,
              latitude: coords.latitude,
              longitude: coords.longitude,
              isValidCoordinates: coords.isValid,
            };
          })
          .filter((pro) => pro.isValidCoordinates)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ isValidCoordinates, ...pro }) => pro);

        const allData: Professional[] = [
          ...mappedProfessionals,
          ...mappedFirstResponders,
        ];

        setAllProfessionalsData(allData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error processing professional data:", err);
        setError("Error processing professional data");
        setLoading(false);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected the socket, need to reconnect manually
        socket.connect();
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setError("Socket connection error");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return { allProfessionalsData, loading, error };
}
