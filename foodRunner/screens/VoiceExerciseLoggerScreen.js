import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import successSound from "../assets/success.mp3"; // 경로에 mp3 파일 위치 필요

const VoiceExerciseLoggerScreen = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [recordedURI, setRecordedURI] = useState(null);
    const [dots, setDots] = useState("");
    const [recognizedText, setRecognizedText] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const soundRef = useRef(null);
    const intervalRef = useRef(null);

    // 점 애니메이션
    useEffect(() => {
        if (isRecording) {
            intervalRef.current = setInterval(() => {
                setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
            }, 300);
        } else {
            clearInterval(intervalRef.current);
            setDots("");
        }
        return () => clearInterval(intervalRef.current);
    }, [isRecording]);

    // 녹음 시작
    const startRecording = async () => {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
            alert("마이크 권한이 필요합니다.");
            return;
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
        setRecognizedText("");
        setRecordedURI(null);
        setIsCompleted(false);
        setShowConfirm(false);
    };

    // 녹음 중지
    const stopRecording = async () => {
        if (!recording) return;

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        setRecordedURI(uri);

        // 텍스트 시뮬레이션
        setTimeout(() => {
            setRecognizedText("벤치프레스 3세트 체스트 프레스 머신 3세트 했어");
            setShowConfirm(true);
        }, 1000);

        // 녹음 자동 재생
        const { sound } = await Audio.Sound.createAsync({ uri });
        soundRef.current = sound;
        await sound.playAsync();
    };

    const toggleRecording = async () => {
        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    const handleConfirm = async () => {
        setIsCompleted(true);
        setShowConfirm(true);
        setRecognizedText("운동추가 완료!");
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.question}>
                    {showConfirm
                        ? isCompleted
                            ? "✅ 운동추가 완료!"
                            : "운동을 추가하시겠습니까?"
                        : "오늘은 무슨 운동을 하셨나요?"}
                </Text>
                <Text style={styles.example}>"런지 10회 5세트 했어"</Text>
                <Text style={styles.example}>"러닝 30분 뛰었어"</Text>

                {isRecording && <Text style={styles.dots}>{dots}</Text>}
                {!isRecording && recognizedText && (
                    <Text style={styles.result}>{recognizedText}</Text>
                )}

                {!isRecording && showConfirm && !isCompleted && (
                    <TouchableOpacity style={styles.checkButton} onPress={handleConfirm}>
                        <AntDesign name="checkcircle" size={32} color="black" />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
                onPress={toggleRecording}
            >
                <AntDesign name="sound" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "80%",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
    },
    question: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
    example: {
        color: "#ccc",
        marginVertical: 2,
    },
    dots: {
        fontSize: 24,
        marginTop: 30,
        color: "#E1FF01",
        letterSpacing: 4,
    },
    result: {
        color: "#fff",
        marginTop: 30,
        fontSize: 16,
        textAlign: "center",
    },
    voiceButton: {
        position: "absolute",
        bottom: 60,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    voiceButtonActive: {
        backgroundColor: "#E1FF01",
        shadowColor: "#E1FF01",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
    },
    checkButton: {
        marginTop: 30,
        backgroundColor: "#E1FF01",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default VoiceExerciseLoggerScreen;
