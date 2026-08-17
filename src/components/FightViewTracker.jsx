import { useEffect, useRef } from "react";
import { trackFightView } from "../analytics";

export default function FightViewTracker({ eventId, fight, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const fightId = fight?._id;
    if (!node || !eventId || !fightId) return;

    function fire() {
      trackFightView({
        eventId,
        fightId,
        isMainEvent: fight.isMainEvent,
        isTitleFight: fight.isTitleFight,
        weightClass: fight.weightClass,
        fightOrder: fight.fightOrder,
      });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        fire();
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eventId, fight?._id]);

  return <div ref={ref}>{children}</div>;
}
