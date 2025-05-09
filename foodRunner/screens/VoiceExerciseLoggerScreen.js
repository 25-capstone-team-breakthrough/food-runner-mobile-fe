import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import backgroundImage from '../assets/body.png';
import BackButton from "../components/BackButton";

const VoiceExerciseLoggerScreen = ({ navigation }) => {
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
    // 녹음 중지
const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setIsRecording(false);
    setRecordedURI(uri);

    // 🎯 백엔드 전송, 
    // { 백에서 이렇게 받아야 됨
    //     "text": "벤치프레스 3세트 체스트 프레스 머신 3세트 했어"
    // }
    try {
        const formData = new FormData();
        formData.append("file", {
            uri,
            name: "recording.m4a",
            type: "audio/m4a"
        });

        const response = await fetch("http://ec2-13-209-199-97.ap-northeast-2.compute.amazonaws.com:8080/upload", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const data = await response.json();
        setRecognizedText(data.text); // 예: data.text = "벤치프레스 3세트 체스트 프레스 머신 3세트 했어"
    } catch (error) {
        console.error("음성 전송 실패:", error);
        setRecognizedText("⚠️ 음성 인식 실패! 다시 시도해주세요.");
    }

    setShowConfirm(true);

    // 자동 재생
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
        setRecognizedText("백에서 받은 텍스트!");
    };

    return (
        
        <View style={{ flex: 1, backgroundColor: "black", alignItems: 'center', justifyContent: 'center' }}>
        
        <View style={styles.imageWrapper}>
          <Image source={backgroundImage} style={styles.backgroundImage} />
          <BlurView intensity={15} tint="dark" style={styles.blurView} />
        </View>
        <View style={styles.container}>
        <View style={styles.backButtonWrapper}>
            <BackButton onPress={() => navigation.goBack()} color="white" /> 
        </View>
            <View style={styles.card}>

                {/* <View style={styles.questionBlock}> */}
                    {showConfirm ? (
                        isCompleted ? (
                        <>
                            <Text style={styles.question}>✅ 운동추가 완료!</Text>
                            {recognizedText && (
                            <View style={styles.resultContainer}>
                                <Text style={styles.result}>
                                    {recognizedText}
                                </Text>
                            </View>
                            )}
                        </>
                        ) : (
                        <>
                            <Text style={styles.question}>운동을{"\n"}추가하시겠습니까?</Text>
                        </>
                        )
                    ) : (
                        <>
                        <Text style={styles.question}>오늘은 무슨{"\n"}운동을 하셨나요?</Text>
                        </>
                    )}
                    {/* </View> */}


                {!showConfirm && (
                    <>
                        <Text style={styles.example}>"런지 10회 5세트 했어"</Text>
                        <Text style={styles.example}>"러닝 30분 뛰었어"</Text>
                    </>
                    )}

                {isRecording && <Text style={styles.dots}>{dots}</Text>}

                {!isRecording && showConfirm && !isCompleted && (
                <>
                    {recognizedText && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.result}>
                            {recognizedText}
                        </Text>
                    </View>
                    )}
                    <TouchableOpacity style={styles.checkButton} onPress={handleConfirm}>
                        <AntDesign name="check" size={32} color="black" />
                    </TouchableOpacity>
                </>
                )}
            </View>

            <TouchableOpacity
                style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
                onPress={toggleRecording}
            >
                <Ionicons name="mic" size={30} color="black" />
            </TouchableOpacity>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    imageWrapper: {
        width: '80%',
        height: '80%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20, 
    },
    blurView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20, 
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    backButtonWrapper: {
        position: 'absolute',
        top: 40,      
        left: 10,     
        zIndex: 100,  
    },
    card: {
        width: 360,
        height: 400,
        backgroundColor: 'rgba(45, 45, 53, 0.93)',
        borderRadius: 30,
        padding: 30,
    },  
    question: {
        fontSize: 30,
        fontWeight: "700",
        color: "white",
        marginBottom: 10,
    },
    example: {
        fontSize: 16,
        color: "#B3B3B3",
        marginVertical: 2,
    },
    dots: {
        fontSize: 60,
        textAlign: "center",
        marginTop: 40,
        color: "#E1FF01",
        letterSpacing: 4,
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    result: {
        color: "#fff",
        justifyContent: "center",
        fontSize: 25,
        textAlign: "center",
        fontWeight: "600",
        marginBottom: 60,
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
        bottom: 60,
        alignItems: "center",
    },
    checkButton: {
        position: 'absolute',
        bottom: 30,
        left: "50%",
        backgroundColor: "#E1FF01",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default VoiceExerciseLoggerScreen;
