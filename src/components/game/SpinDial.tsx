'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react';

const MIN_VELOCITY_TO_STOP = 1.5;
const FRICTION_PER_FRAME = 0.965;
const MOMENTUM_BLEND = 0.35;
const HIDE_SLIDE_V_CENTER_Y_PERCENT = 27.8336;
const FRONT_DIAL_GEAR_CENTER_X_PERCENT = 50;
const FRONT_DIAL_GEAR_CENTER_Y_PERCENT = 74.1291;
const STATIC_COVER_DIAMETER_PERCENT = 88;
const HIDE_SLIDE_ROTATION_MIN_DEG = -18;
const HIDE_SLIDE_ROTATION_MAX_DEG = 158;
const FRONT_DIAL_ROTATION_MIN_DEG = -86;
const FRONT_DIAL_ROTATION_MAX_DEG = 86;

type Point = {
  x: number;
  y: number;
};

type SpinDialSize = 'default' | 'compact';

type SpinDialProps = {
  size?: SpinDialSize;
};

function wrapAngleDelta(delta: number): number {
  if (delta > Math.PI) {
    return delta - Math.PI * 2;
  }

  if (delta < -Math.PI) {
    return delta + Math.PI * 2;
  }

  return delta;
}

function angleFromCenter(point: Point, center: Point): number {
  return Math.atan2(point.y - center.y, point.x - center.x);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function SpinDial({ size = 'default' }: SpinDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const hideSlideRotorRef = useRef<HTMLDivElement>(null);
  const hideGrabRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const lastPointerAngleRef = useRef<number | null>(null);
  const lastPointerTimeRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const hidePointerIdRef = useRef<number | null>(null);
  const hideLastPointerAngleRef = useRef<number | null>(null);
  const frontDialRef = useRef<HTMLDivElement>(null);
  const frontPointerIdRef = useRef<number | null>(null);
  const frontLastPointerAngleRef = useRef<number | null>(null);

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hideRotation, setHideRotation] = useState(0);
  const [isHideDragging, setIsHideDragging] = useState(false);
  const [frontRotation, setFrontRotation] = useState(0);
  const [isFrontDragging, setIsFrontDragging] = useState(false);

  const stopMomentum = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    lastFrameTimeRef.current = null;
  }, []);

  const startMomentum = useCallback(() => {
    if (Math.abs(velocityRef.current) < MIN_VELOCITY_TO_STOP) {
      velocityRef.current = 0;
      return;
    }

    stopMomentum();

    const step = (time: number) => {
      const lastTime = lastFrameTimeRef.current;

      if (lastTime === null) {
        lastFrameTimeRef.current = time;
        frameRef.current = requestAnimationFrame(step);
        return;
      }

      const dt = time - lastTime;
      lastFrameTimeRef.current = time;

      setRotation((prev) => prev + (velocityRef.current * dt) / 1000);

      const friction = Math.pow(FRICTION_PER_FRAME, dt / 16.667);
      velocityRef.current *= friction;

      if (Math.abs(velocityRef.current) < MIN_VELOCITY_TO_STOP) {
        stopMomentum();
        velocityRef.current = 0;
        return;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
  }, [stopMomentum]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dialRef.current) {
        return;
      }

      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      event.preventDefault();
      stopMomentum();

      const rect = dialRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const dialDiameter = Math.min(
        dialRef.current.clientWidth,
        dialRef.current.clientHeight
      );
      const staticCoverRadius =
        (dialDiameter / 2) * (STATIC_COVER_DIAMETER_PERCENT / 100);

      const pointer = { x: event.clientX, y: event.clientY };
      const distanceFromCenter = Math.hypot(
        pointer.x - center.x,
        pointer.y - center.y
      );

      if (distanceFromCenter < staticCoverRadius) {
        return;
      }

      lastPointerAngleRef.current = angleFromCenter(pointer, center);
      lastPointerTimeRef.current = event.timeStamp;
      pointerIdRef.current = event.pointerId;
      velocityRef.current = 0;

      setIsDragging(true);
      dialRef.current.setPointerCapture(event.pointerId);
    },
    [stopMomentum]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !dialRef.current ||
        pointerIdRef.current !== event.pointerId ||
        !isDragging
      ) {
        return;
      }

      const rect = dialRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const pointer = { x: event.clientX, y: event.clientY };
      const nextAngle = angleFromCenter(pointer, center);
      const prevAngle = lastPointerAngleRef.current;
      const prevTime = lastPointerTimeRef.current;

      if (prevAngle === null || prevTime === null) {
        lastPointerAngleRef.current = nextAngle;
        lastPointerTimeRef.current = event.timeStamp;
        return;
      }

      const angleDelta = wrapAngleDelta(nextAngle - prevAngle);
      const angleDeltaDeg = (angleDelta * 180) / Math.PI;
      const dt = Math.max(1, event.timeStamp - prevTime);
      const instVelocity = (angleDeltaDeg / dt) * 1000;

      velocityRef.current =
        velocityRef.current * (1 - MOMENTUM_BLEND) +
        instVelocity * MOMENTUM_BLEND;

      setRotation((prev) => prev + angleDeltaDeg);

      lastPointerAngleRef.current = nextAngle;
      lastPointerTimeRef.current = event.timeStamp;
    },
    [isDragging]
  );

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dialRef.current || pointerIdRef.current !== event.pointerId) {
        return;
      }

      setIsDragging(false);
      pointerIdRef.current = null;
      lastPointerAngleRef.current = null;
      lastPointerTimeRef.current = null;

      if (dialRef.current.hasPointerCapture(event.pointerId)) {
        dialRef.current.releasePointerCapture(event.pointerId);
      }

      startMomentum();
    },
    [startMomentum]
  );

  useEffect(() => {
    return () => {
      stopMomentum();
    };
  }, [stopMomentum]);

  const onHidePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!hideSlideRotorRef.current || !hideGrabRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const rect = hideSlideRotorRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const pointer = { x: event.clientX, y: event.clientY };
      hideLastPointerAngleRef.current = angleFromCenter(pointer, center);
      hidePointerIdRef.current = event.pointerId;

      setIsHideDragging(true);
      hideGrabRef.current.setPointerCapture(event.pointerId);
    },
    []
  );

  const onHidePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !hideSlideRotorRef.current ||
        hidePointerIdRef.current !== event.pointerId ||
        !isHideDragging
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const rect = hideSlideRotorRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const pointer = { x: event.clientX, y: event.clientY };
      const nextAngle = angleFromCenter(pointer, center);
      const prevAngle = hideLastPointerAngleRef.current;

      if (prevAngle === null) {
        hideLastPointerAngleRef.current = nextAngle;
        return;
      }

      const angleDelta = wrapAngleDelta(nextAngle - prevAngle);
      const angleDeltaDeg = (angleDelta * 180) / Math.PI;

      setHideRotation((prev) =>
        clamp(
          prev + angleDeltaDeg,
          HIDE_SLIDE_ROTATION_MIN_DEG,
          HIDE_SLIDE_ROTATION_MAX_DEG
        )
      );
      hideLastPointerAngleRef.current = nextAngle;
    },
    [isHideDragging]
  );

  const onHidePointerEnd = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !hideGrabRef.current ||
        hidePointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setIsHideDragging(false);
      hidePointerIdRef.current = null;
      hideLastPointerAngleRef.current = null;

      if (hideGrabRef.current.hasPointerCapture(event.pointerId)) {
        hideGrabRef.current.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  const onFrontPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!frontDialRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const rect = frontDialRef.current.getBoundingClientRect();
      const pivot = {
        x: rect.left + (rect.width * FRONT_DIAL_GEAR_CENTER_X_PERCENT) / 100,
        y: rect.top + (rect.height * FRONT_DIAL_GEAR_CENTER_Y_PERCENT) / 100,
      };

      const pointer = { x: event.clientX, y: event.clientY };
      frontLastPointerAngleRef.current = angleFromCenter(pointer, pivot);
      frontPointerIdRef.current = event.pointerId;

      setIsFrontDragging(true);
      frontDialRef.current.setPointerCapture(event.pointerId);
    },
    []
  );

  const onFrontPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !frontDialRef.current ||
        frontPointerIdRef.current !== event.pointerId ||
        !isFrontDragging
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const rect = frontDialRef.current.getBoundingClientRect();
      const pivot = {
        x: rect.left + (rect.width * FRONT_DIAL_GEAR_CENTER_X_PERCENT) / 100,
        y: rect.top + (rect.height * FRONT_DIAL_GEAR_CENTER_Y_PERCENT) / 100,
      };

      const pointer = { x: event.clientX, y: event.clientY };
      const nextAngle = angleFromCenter(pointer, pivot);
      const prevAngle = frontLastPointerAngleRef.current;

      if (prevAngle === null) {
        frontLastPointerAngleRef.current = nextAngle;
        return;
      }

      const angleDelta = wrapAngleDelta(nextAngle - prevAngle);
      const angleDeltaDeg = (angleDelta * 180) / Math.PI;

      setFrontRotation((prev) =>
        clamp(
          prev + angleDeltaDeg,
          FRONT_DIAL_ROTATION_MIN_DEG,
          FRONT_DIAL_ROTATION_MAX_DEG
        )
      );
      frontLastPointerAngleRef.current = nextAngle;
    },
    [isFrontDragging]
  );

  const onFrontPointerEnd = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (
        !frontDialRef.current ||
        frontPointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setIsFrontDragging(false);
      frontPointerIdRef.current = null;
      frontLastPointerAngleRef.current = null;

      if (frontDialRef.current.hasPointerCapture(event.pointerId)) {
        frontDialRef.current.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  return (
    <div className="spin-stage">
      <div
        className={`spin-assembly ${
          size === 'compact' ? 'spin-assembly-compact' : ''
        }`}
      >
        <div
          ref={dialRef}
          className={`spin-dial ${isDragging ? 'spin-dial-dragging' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="img"
          aria-label="Spin dial"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <Image
            src="/back-dial.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 1200px) 150vmin, 920px"
            draggable={false}
          />
          <div className="spin-selection-wheel">
            <Image
              src="/selection-wheel.svg"
              alt=""
              fill
              priority
              sizes="(max-width: 1200px) 52vmin, 315px"
              draggable={false}
            />
          </div>
        </div>
        <div
          className="spin-hide-slide-rotor spin-hide-slide-cover-layer"
          style={{
            transform: `translate(-50%, -${HIDE_SLIDE_V_CENTER_Y_PERCENT}%) rotate(${hideRotation}deg)`,
          }}
        >
          <div className="spin-hide-slide-cover">
            <Image
              src="/hide-slide-cover.svg"
              alt=""
              fill
              priority
              sizes="(max-width: 1200px) 104vmin, 640px"
              draggable={false}
            />
          </div>
        </div>
        <div className="spin-static-cover">
          <Image
            src="/static-cover.svg"
            alt=""
            fill
            priority
            sizes="(max-width: 1200px) 108vmin, 662px"
            draggable={false}
          />
        </div>
        <div
          ref={hideSlideRotorRef}
          className={`spin-hide-slide-rotor spin-hide-slide-grab-layer ${
            isHideDragging ? 'spin-hide-slide-grab-dragging' : ''
          }`}
          style={{
            transform: `translate(-50%, -${HIDE_SLIDE_V_CENTER_Y_PERCENT}%) rotate(${hideRotation}deg)`,
          }}
        >
          <div
            ref={hideGrabRef}
            className="spin-hide-slide-grab"
            onPointerDown={onHidePointerDown}
            onPointerMove={onHidePointerMove}
            onPointerUp={onHidePointerEnd}
            onPointerCancel={onHidePointerEnd}
          >
            <Image
              src="/hide-slide-grab.svg"
              alt=""
              fill
              priority
              sizes="(max-width: 1200px) 44vmin, 270px"
              draggable={false}
            />
          </div>
        </div>
        <div
          ref={frontDialRef}
          className={`spin-front-dial-layer ${
            isFrontDragging ? 'spin-front-dial-dragging' : ''
          }`}
          onPointerDown={onFrontPointerDown}
          onPointerMove={onFrontPointerMove}
          onPointerUp={onFrontPointerEnd}
          onPointerCancel={onFrontPointerEnd}
          style={{
            transform: `translate(-50%, -${FRONT_DIAL_GEAR_CENTER_Y_PERCENT}%)`,
          }}
        >
          <div
            className="spin-front-dial-rotator"
            style={{ transform: `rotate(${frontRotation}deg)` }}
          >
            <div className="spin-front-dial">
              <Image
                src="/front-dial.svg"
                alt=""
                fill
                priority
                sizes="(max-width: 1200px) 32vmin, 196px"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="spin-cards-overlay" aria-hidden="true">
          <div className="spin-cards">
            <Image
              src="/cards.svg"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 72vw, 280px"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
