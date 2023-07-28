import React, { useState, useEffect, useCallback, useRef } from "react";
import { getUserConnected } from "../../API/chat";
import { NumberSpring } from "../Number/NumberSpring";

interface configNumber {
  from: 0;
  to: 0;
}

export const NbUser = ({ roomId }: { roomId: string }) => {
  const [ethConfig, setEthConfig] = useState<configNumber>({
    from: 0,
    to: 0,
  });
  const [solConfig, setSolConfig] = useState<configNumber>({
    from: 0,
    to: 0,
  });
  const [total, setTotal] = useState<configNumber>({
    from: 0,
    to: 0,
  });
  const [loop, setLoop] = useState(0);
  const getUser = useCallback(() => {
    // launch this function every 3min
    getUserConnected(roomId).then((res) => {
      if (res.error) {
        return;
      }
      const eth = res.data?.eth ?? 0;
      const sol = res.data?.sol ?? 0;
      const total = res.data?.total ?? 0;

      setEthConfig({ from: loop === 0 ? 0 : ethConfig.to, to: eth });
      setSolConfig({ from: loop === 0 ? 0 : ethConfig.to, to: sol });
      setTotal({ from: loop === 0 ? 0 : ethConfig.to, to: total });

      setLoop((prev) => prev + 1);
    });
  }, [ethConfig.to, loop, roomId]);

  useEffect(() => {
    const heartbeatInterval = setInterval(getUser, 180000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [getUser, roomId]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="mt-2 flex justify-end mr-2">
      <div className="flex bg-neutral-800 rounded w-fit">
        <div className="flex gap-2 py-2 border-r border-[#151419] items-center justify-center px-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19" fill="none">
            <path
              d="M12.75 12C13.716 12 14.5 12.784 14.5 13.75L14.499 14.712C14.616 16.902 12.988 18.009 10.067 18.009C7.157 18.009 5.5 16.919 5.5 14.75V13.75C5.5 12.784 6.284 12 7.25 12H12.75ZM1.75 7H6.126C5.95152 7.67899 5.95823 8.39188 6.14546 9.06746C6.3327 9.74305 6.6939 10.3577 7.193 10.85L7.355 11.001L7.25 11C6.64983 10.9998 6.06606 11.1959 5.58778 11.5585C5.10949 11.921 4.76294 12.4301 4.601 13.008L4.567 13.009C1.657 13.009 0 11.919 0 9.75V8.75C0 7.784 0.784 7 1.75 7ZM18.25 7C19.216 7 20 7.784 20 8.75L19.999 9.712C20.116 11.902 18.488 13.009 15.567 13.009L15.398 13.007C15.2443 12.4623 14.9265 11.9781 14.488 11.6203C14.0495 11.2625 13.5115 11.0484 12.947 11.007L12.75 11L12.645 11.001C13.2001 10.5134 13.6089 9.88129 13.8259 9.17504C14.0429 8.46879 14.0596 7.71615 13.874 7.001L18.25 7ZM10 5C10.394 5 10.7841 5.0776 11.1481 5.22836C11.512 5.37913 11.8427 5.6001 12.1213 5.87868C12.3999 6.15726 12.6209 6.48797 12.7716 6.85195C12.9224 7.21593 13 7.60603 13 8C13 8.39397 12.9224 8.78407 12.7716 9.14805C12.6209 9.51203 12.3999 9.84274 12.1213 10.1213C11.8427 10.3999 11.512 10.6209 11.1481 10.7716C10.7841 10.9224 10.394 11 10 11C9.20435 11 8.44129 10.6839 7.87868 10.1213C7.31607 9.55871 7 8.79565 7 8C7 7.20435 7.31607 6.44129 7.87868 5.87868C8.44129 5.31607 9.20435 5 10 5ZM4.5 0C5.29565 0 6.05871 0.316071 6.62132 0.87868C7.18393 1.44129 7.5 2.20435 7.5 3C7.5 3.79565 7.18393 4.55871 6.62132 5.12132C6.05871 5.68393 5.29565 6 4.5 6C3.70435 6 2.94129 5.68393 2.37868 5.12132C1.81607 4.55871 1.5 3.79565 1.5 3C1.5 2.20435 1.81607 1.44129 2.37868 0.87868C2.94129 0.316071 3.70435 0 4.5 0ZM15.5 0C16.2956 0 17.0587 0.316071 17.6213 0.87868C18.1839 1.44129 18.5 2.20435 18.5 3C18.5 3.79565 18.1839 4.55871 17.6213 5.12132C17.0587 5.68393 16.2956 6 15.5 6C14.7044 6 13.9413 5.68393 13.3787 5.12132C12.8161 4.55871 12.5 3.79565 12.5 3C12.5 2.20435 12.8161 1.44129 13.3787 0.87868C13.9413 0.316071 14.7044 0 15.5 0Z"
              fill="white"
            />
          </svg>
          <span className="font-bold text-white nbUsers">
            <NumberSpring from={total.from} to={total.to} />
          </span>
        </div>
        <div className="flex px-4 gap-6">
          <div className="flex gap-2">
            <div className="flex gap-2  items-center justify-center ">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15" fill="none">
                <path
                  d="M15.4102 3.55055C15.357 3.60623 15.2936 3.65047 15.2237 3.6807C15.1538 3.71094 15.0788 3.72657 15.003 3.72669H0.577016C0.0670766 3.72669 -0.191223 3.0862 0.165266 2.70583L2.53154 0.180772C2.58483 0.123725 2.64873 0.0783175 2.71943 0.0472594C2.79012 0.0162012 2.86617 0.000128502 2.94302 0L17.423 0C17.936 0 18.193 0.647164 17.8302 1.02567L15.4102 3.55055ZM15.4102 14.8284C15.3016 14.9385 15.1553 15.0001 15.003 15H0.577016C0.0670766 15 -0.191223 14.3755 0.165266 14.0046L2.53154 11.5426C2.58549 11.4867 2.64965 11.4424 2.72032 11.4122C2.79099 11.3819 2.86677 11.3664 2.94329 11.3665H17.423C17.936 11.3665 18.193 11.9974 17.8302 12.3665L15.4102 14.8284ZM15.4102 5.8547C15.3016 5.74466 15.1553 5.68309 15.003 5.68329H0.577016C0.0670766 5.68329 -0.191223 6.30774 0.165266 6.67865L2.53154 9.14058C2.58545 9.19645 2.64956 9.24079 2.72019 9.27102C2.79081 9.30125 2.86654 9.31678 2.94302 9.31671H17.423C17.936 9.31671 18.193 8.68577 17.8302 8.31681L15.4102 5.8547Z"
                  fill="white"
                />
              </svg>
              <span className="font-bold text-white nbUsers">
                <NumberSpring from={solConfig.from} to={solConfig.to} />
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center ">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="20" viewBox="0 0 13 20" fill="none">
              <path
                d="M6.13937 14.9744L0 11.3513L6.13562 20.0006L12.2781 11.3513L6.13562 14.9744H6.13937ZM6.23063 0L0.0937501 10.1856L6.23063 13.815L12.37 10.1894L6.23063 0Z"
                fill="white"
              />
            </svg>
            <span id="nbETH" className={`font-bold text-white`}>
              <NumberSpring from={ethConfig.from} to={ethConfig.to} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
