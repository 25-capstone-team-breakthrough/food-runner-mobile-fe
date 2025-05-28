import React from 'react';
import { Text } from 'react-native';
import AppLoading from 'expo-app-loading';

import {
  useFonts as useNotoFonts,
  NotoSansKR_400Regular,
} from '@expo-google-fonts/noto-sans-kr';

import {
  useFonts as useInterFonts,
  Inter_400Regular,
} from '@expo-google-fonts/inter';

import {
  useFonts as useOutfitFonts,
  Outfit_400Regular,
} from '@expo-google-fonts/outfit';

export default function FontProvider({ children }) {
  const [notoLoaded] = useNotoFonts({ NotoSansKR_400Regular });
  const [interLoaded] = useInterFonts({ Inter_400Regular });
  const [outfitLoaded] = useOutfitFonts({ Outfit_400Regular });

  const fontsReady = notoLoaded && interLoaded && outfitLoaded;

  if (!fontsReady) return <AppLoading />;

  // ✅ 기본 Text에 전역 폰트 적용
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'NotoSansKR_400Regular' };

  return children;
}
