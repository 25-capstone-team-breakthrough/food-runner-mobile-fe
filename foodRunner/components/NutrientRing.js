// components/NutrientRing.js
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const NutrientRing = ({ percent, color, label, amount, status }) => {
    const radius = 32;
    const strokeWidth = 5;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference * (1 - percent / 100);

    return (
        <View style={{ alignItems: "center", marginHorizontal: 10 }}>
            <Svg width={radius * 2} height={radius * 2}>
                <Circle
                    stroke="#ddd"
                    fill="none"
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={color}
                    fill="none"
                    cx={radius}
                    cy={radius}
                    r={normalizedRadius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${radius}, ${radius}`}
                />
            </Svg>
            <View style={{ position: "absolute", top: radius - 14, alignItems: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "bold", color }}>{status}</Text>
                <Text style={{ fontSize: 12 }}>{amount}</Text>
            </View>
            <Text style={{ fontSize: 13, marginTop: 6 }}>{label}</Text>
        </View>
    );
};

export default NutrientRing;
