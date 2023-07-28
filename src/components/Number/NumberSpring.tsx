import { useSpring, animated } from "react-spring";

export const NumberSpring = ({ from, to }: { from: number; to: number }) => {
  const { number } = useSpring({
    number: to,
    from: { number: from },
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
};
