import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React from "react";
import { Text, View } from "react-native";

const HalfCircleSkiaChart = ({
  progress = 0.9,
  size = 280,
  strokeWidth = 30,
  progressStrokeWidth = 36,
}) => {
  const padding = 24;
  const canvasWidth = size + padding * 2;
  const canvasHeight = size / 2 + padding;

  const radius = (size - progressStrokeWidth) / 2;
  const centerX = canvasWidth / 2;
  const centerY = size / 2 + padding / 2;

  const startAngle = Math.PI;
  const sweepAngle = progress * Math.PI;

  // 진행 Arc Path
  const arc = Skia.Path.Make();
  arc.addArc(
    {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
    },
    (startAngle * 180) / Math.PI,
    (sweepAngle * 180) / Math.PI
  );

  // 배경 Arc Path
  const bgArc = Skia.Path.Make();
  bgArc.addArc(
    {
      x: centerX - radius,
      y: centerY - radius,
      width: radius * 2,
      height: radius * 2,
    },
    180,
    180
  );

  // // ✅ Inner Shadow 느낌을 주는 그라디언트 Paint (hex or rgba array)
  // const innerShadowPaint = Skia.Paint();
  // innerShadowPaint.setShader(
  //   Skia.Shader.MakeLinearGradient(
  //     { x: centerX, y: centerY - radius },
  //     { x: centerX, y: centerY + radius },
  //     [
  //       Skia.Color([255, 255, 255, 38]), // 밝은 위쪽 (15% 불투명)
  //       Skia.Color([0, 0, 0, 64])        // 어두운 아래쪽 (25% 불투명)
  //     ],
  //     [0, 1],
  //     "clamp"
  //   )
  // );
  // innerShadowPaint.setStyle("stroke");
  // innerShadowPaint.setStrokeWidth(progressStrokeWidth);
  // innerShadowPaint.setStrokeCap("round");

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

        {/* Inner Shadow 느낌 그라디언트 오버레이 */}
        {/* <Path
          path={arc}
          paint={innerShadowPaint}
        /> */}
      </Canvas>

      {/* 텍스트 */}
      <View style={{ position: "absolute", top: size * 0.28, alignItems: "center" }}>
        <Text style={{ fontSize: 35, fontWeight: "600", marginBottom: 5 }}>
          {Math.round(progress * 2000)}
        </Text>
        <Text style={{ fontSize: 17, fontWeight: "400", color: "#000" }}>
          권장 2,000kcal
        </Text>
      </View>
    </View>
  );
};

export default HalfCircleSkiaChart;
