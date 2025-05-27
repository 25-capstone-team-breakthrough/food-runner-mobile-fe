import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Text, View } from "react-native";

const HalfCircleSkiaChart = ({
  progress = 0.9,
  size = 280,
  strokeWidth = 30,
  progressStrokeWidth = 36,
  targetCalories = 2000,
}) => {
  const padding = 24;
  const canvasWidth = size + padding * 2;
  const canvasHeight = size / 2 + padding;

  const radius = (size - progressStrokeWidth) / 2;
  const centerX = canvasWidth / 2;
  const centerY = size / 2 + padding / 2;

  const startAngle = Math.PI;
  const sweepAngle = progress * Math.PI;

  const arc = useMemo(() => {
    const sweepAngle = progress * Math.PI;
    const path = Skia.Path.Make();
    path.addArc(
      {
        x: centerX - radius,
        y: centerY - radius,
        width: radius * 2,
        height: radius * 2,
      },
      180,
      (sweepAngle * 180) / Math.PI
    );
    return path;
  }, [progress, centerX, centerY, radius]);

  // 배경 Arc Path (고정)
  const bgArc = useMemo(() => {
    const path = Skia.Path.Make();
    path.addArc(
      {
        x: centerX - radius,
        y: centerY - radius,
        width: radius * 2,
        height: radius * 2,
      },
      180,
      180
    );
    return path;
  }, [centerX, centerY, radius]);

  // // 진행 Arc Path
  // const arc = Skia.Path.Make();
  // arc.addArc(
  //   {
  //     x: centerX - radius,
  //     y: centerY - radius,
  //     width: radius * 2,
  //     height: radius * 2,
  //   },
  //   (startAngle * 180) / Math.PI,
  //   (sweepAngle * 180) / Math.PI
  // );

  // // 배경 Arc Path
  // const bgArc = Skia.Path.Make();
  // bgArc.addArc(
  //   {
  //     x: centerX - radius,
  //     y: centerY - radius,
  //     width: radius * 2,
  //     height: radius * 2,
  //   },
  //   180,
  //   180
  // );


  return (
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        {/* 배경 반원 */}
        <Path
          path={bgArc}
          style="stroke"
          color="#D9D9D9"
          strokeWidth={strokeWidth}
        />

        {/* 진행 Arc */}
        <Path
          path={arc}
          style="stroke"
          color="#E1FF01"
          strokeWidth={progressStrokeWidth}
          strokeCap="butt"
        />

      </Canvas>

      {/* 텍스트 */}
      <View style={{ position: "absolute", top: size * 0.28, alignItems: "center" }}>
        <Text style={{ fontSize: 35, fontWeight: "600", marginBottom: 5 }}>
          {/* {Math.round(progress * 2000)} */}
          {Math.round(progress * targetCalories)}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: "400", color: "#000" }}>
          권장 {targetCalories}kcal
        </Text>
      </View>
    </View>
  );
};

export default HalfCircleSkiaChart;
