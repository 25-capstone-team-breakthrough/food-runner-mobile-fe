import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import backgroundImage from '../assets/body.png';
import BackButton from "../components/BackButton";


// 아 그러면 /stt/audio 이걸로 내가 백한테 음성파일 wav로 주면
// /stt/audio에서 백이 나한테 텍스트 주고, 
// 프론트가 저장버튼 누르면 stt/log 호출해서
//  transcript에 담아서 주면 너네가 내부적으로 저장하는거지?

const VoiceExerciseLoggerScreen = ({ navigation }) => {
    const [isRecording, setIsRecording] = useState(false); // 현재 녹음 중인지?
    const [recording, setRecording] = useState(null); // Audio.Recording 객체 저장
    const [recordedURI, setRecordedURI] = useState(null); // 녹음된 오디오 파일의 url
    const [dots, setDots] = useState(""); // ... 문자열
    const [recognizedText, setRecognizedText] = useState(""); // 백엔드에서 받은 텍스트 결과
    const [isCompleted, setIsCompleted] = useState(false); // 운동 기록이 완료됐는지 여부
    const [showConfirm, setShowConfirm] = useState(false); // 확인 화면 보여줄지 여부
    const soundRef = useRef(null);
    const intervalRef = useRef(null);

    // 녹음 시작
    const startRecording = async () => {
        // 마이크 권한
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
            alert("마이크 권한이 필요합니다.");
            return;
        }
        
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        // 녹음 세팅
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

    

    // 녹음 중지 -> 여기서 음성 백으로 전달해야 함
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
            formData.append("audioFile", {
                uri: uri,
                name: "recording.m4a",
                type: "audio/x-m4a"
                // name: "recording.wav",
                // type: "audio/wav" 
            });
            // console.log("프론트 전달 uri: ", uri);

            const token = await AsyncStorage.getItem("token");

            const response = await fetch("http://13.209.199.97:8080/stt/audio", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`, 
                }
            });

            const data = await response.text();
            setRecognizedText(data); // 예: data.text = "벤치프레스 3세트 체스트 프레스 머신 3세트 했어"
            console.log("백에서 온 음성 텍스트 :",data);
            console.log("서버 응답 상태: ", response.status)
        } catch (error) {
            console.error("음성 전송 실패:", error);
            setRecognizedText("⚠️ 음성 인식 실패! 다시 시도해주세요.");
        }

        setShowConfirm(true);

        // 자동 재생 메이비 녹음한거 재생
        // const { sound } = await Audio.Sound.createAsync({ uri });
        // soundRef.current = sound;
        // await sound.playAsync();

        useEffect(() => {
            return () => {
                if (soundRef.current) {
                    soundRef.current.unloadAsync();
                }
            };
        }, []);
    };

    // 하단 녹음 버튼 
    const toggleRecording = async () => {
        if (isRecording) {
            await stopRecording();
        } else {
            await startRecording();
        }
    };

    // 백에서 음성 텍스트 받고 확인 버튼 -> 운동일지에 추가되는 버튼 , api호출해서 나중에 추가해야 함
    // 프론트가 저장버튼 누르면 stt/log 호출해서
    // transcript에 담아서 주면 너네가 내부적으로 저장하는거지? 
    const handleConfirm = async () => {
        if (!recognizedText) return;

        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch("http://13.209.199.97:8080/stt/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    transcript: recognizedText
                })
            });

            if (response.ok) {
                const resultText = await response.text();
                console.log("✅ 운동 기록 저장 완료:", resultText);
                setIsCompleted(true);
            } else {
                const errText = await response.text();
                console.error("❌ 저장 실패:", errText);
                setRecognizedText("⚠️ 음성인식이 실패했습니다 다시 정확하게 말해주세요!");
            }
        } catch (err) {
            console.error("❌ 저장 요청 오류:", err);
            setRecognizedText("⚠️ 저장 중 오류 발생!");
        }

        setShowConfirm(true);
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
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.checkButton2}>
                                <AntDesign name="check" size={28} color="black" />
                            </View>
                            <Text style={styles.question2}>운동추가 완료!</Text>
                            {console.log("recognizedText", recognizedText)}
                        </View>
                            
                                <View style={styles.resultContainer2}>
                                <Text style={styles.result}>
                                    {recognizedText}
                                </Text>
                                </View>
                    
                            {/* <TouchableOpacity onPress={() => navigation.navigate("ExerciseHistory")}>
                                <Text style={styles.goHistory}>
                                    운동 기록 보러가기 →
                                </Text>
                            </TouchableOpacity> */}

                            {/* <TouchableOpacity onPress={() => navigation.navigate("ExerciseHome", { openHistorySheet: true })}>
                                <Text>운동 기록 보러가기 →</Text>
                            </TouchableOpacity> */}


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

                
                {!showConfirm && (
                    <>
                        <Text style={styles.example}>"데드리프트 2세트 10회 20kg 했어"</Text>
                        <Text style={styles.example}>"런닝머신 30분 5km 뛰었어"</Text>
                    </>
                )}

                {/* 녹음 중일때는 점점점 */}
                {isRecording && <Text style={styles.dots}>{dots}</Text>}
                
                {/* 녹음 끝나구  */}
                {!isRecording && showConfirm && !isCompleted && (
                <>
                    {recognizedText && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.result}>
                            {recognizedText}
                        </Text>
                    </View>
                    )}
                    {/* 운동 일지에 추가 버튼 */}
                    <TouchableOpacity style={styles.checkButton} onPress={handleConfirm}>
                        <AntDesign name="check" size={32} color="black" />
                    </TouchableOpacity>
                </>
                )}
            </View>

            {/* 하단 녹음 버튼 */}
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
    question2: {
        fontSize: 30,
        fontWeight: "700",
        color: "white",
        marginLeft: 15,
        
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
        // flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 80,

    },
    resultContainer2: {
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 115,
    },
    result: {
        color: "#fff",
        justifyContent: "center",
        fontSize: 25,
        textAlign: "center",
        fontWeight: "600",
        marginBottom: 60,
    },
    goHistory: {
        color: "#E1FF01", 
        fontSize: 18, 
        fontWeight: "600",
        marginTop: 80,
        marginLeft: 145,
        textDecorationLine: "underline",

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
    checkButton2: {
        backgroundColor: "#E1FF01",
        width: 40,
        height: 40,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
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
