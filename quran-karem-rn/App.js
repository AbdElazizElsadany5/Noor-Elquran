import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { AZKAR_DATA, EGYPT_QURAN_RADIO, SURAH_PAGE_RANGES, formatTime } from './src/constants/data';
import SleepTimerModal from './src/components/SleepTimerModal';

let Audio = null;
try {
  Audio = require('expo-av').Audio;
} catch (e) {}

let ExpoAudioSDK57 = null;
try {
  ExpoAudioSDK57 = require('expo-audio');
} catch (e) {}

let RNSlider = null;
try {
  RNSlider = require('@react-native-community/slider');
  if (RNSlider && RNSlider.default) RNSlider = RNSlider.default;
} catch (e) {
  RNSlider = null;
}

function Slider({ value, minimumValue, maximumValue, onSlidingComplete, style, minimumTrackTintColor, maximumTrackTintColor }) {
  if (RNSlider) {
    const SliderComp = RNSlider;
    return (
      <SliderComp
        style={style}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        value={value}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={minimumTrackTintColor || '#059669'}
        maximumTrackTintColor={maximumTrackTintColor || '#cbd5e1'}
        thumbTintColor={minimumTrackTintColor || '#059669'}
      />
    );
  }
  const maxVal = maximumValue || 100;
  const pct = maxVal > 0 ? Math.min(100, Math.max(0, (value / maxVal) * 100)) : 0;
  return (
    <View style={[{ height: 16, justifyContent: 'center', flex: 1 }, style]}>
      <View style={{ height: 6, backgroundColor: maximumTrackTintColor || '#cbd5e1', borderRadius: 3, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: minimumTrackTintColor || '#059669' }} />
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

export default function App() {
  // Theme State (Default Light Mode / الوضع النهاري)
  const [isDark, setIsDark] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('surah'); // 'surah' | 'mushaf' | 'radio' | 'azkar'

  // Data States
  const [allSheikhs, setAllSheikhs] = useState([]);
  const [allRadios, setAllRadios] = useState([]);
  const [allSurahs, setAllSurahs] = useState([]);

  // Search States
  const [sheikhSearch, setSheikhSearch] = useState('');
  const [radioSearch, setRadioSearch] = useState('');
  const [surahSearch, setSurahSearch] = useState('');
  const [mushafSearch, setMushafSearch] = useState('');

  // Selected Items States
  const [selectedSheikhId, setSelectedSheikhId] = useState('');
  const [selectedSurahNum, setSelectedSurahNum] = useState('');
  const [selectedRadioUrl, setSelectedRadioUrl] = useState('');
  const [selectedReadSurahNum, setSelectedReadSurahNum] = useState('1');

  // Ayahs & Text States
  const [quranAyahs, setQuranAyahs] = useState([]);
  const [readSurahAyahs, setReadSurahAyahs] = useState([]);
  const [fontSize, setFontSize] = useState(24);

  // Mushaf Page Reader States (604 Madani Mushaf Pages)
  const [showMushafReader, setShowMushafReader] = useState(false);
  const [mushafPageNum, setMushafPageNum] = useState(1);
  const [pageImageLoading, setPageImageLoading] = useState(false);

  // Loading States
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [loadingReadAyahs, setLoadingReadAyahs] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  // Audio Playback States
  const [currentAudioTitle, setCurrentAudioTitle] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedModal, setShowSpeedModal] = useState(false);

  // Audio Sound Ref for Main Playback
  const soundRef = useRef(null);

  // Salawat Audio States
  const [isSalawatPlaying, setIsSalawatPlaying] = useState(false);
  const salawatSoundRef = useRef(null);

  // Azkar Count States
  const [activeAzkarCategory, setActiveAzkarCategory] = useState('أذكار الصباح');
  const [azkarCounts, setAzkarCounts] = useState({});

  // Sleep Timer States
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(0);
  const [isSleepTimerActive, setIsSleepTimerActive] = useState(false);
  const [timerToastMsg, setTimerToastMsg] = useState('');
  const [showTimerModal, setShowTimerModal] = useState(false);

  // Setup Audio Mode on App Mount
  useEffect(() => {
    try {
      if (Audio && typeof Audio.setAudioModeAsync === 'function') {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        }).catch(() => {});
      }
    } catch (e) {}

    return () => {
      try {
        if (soundRef.current) {
          if (typeof soundRef.current.unloadAsync === 'function') soundRef.current.unloadAsync().catch(() => {});
          else if (typeof soundRef.current.pause === 'function') soundRef.current.pause();
        }
        if (salawatSoundRef.current) {
          if (typeof salawatSoundRef.current.unloadAsync === 'function') salawatSoundRef.current.unloadAsync().catch(() => {});
          else if (typeof salawatSoundRef.current.pause === 'function') salawatSoundRef.current.pause();
        }
      } catch (e) {}
    };
  }, []);

  // Continuous Progress & Time Update Loop while audio is active
  useEffect(() => {
    let interval = null;
    if (isPlaying && soundRef.current) {
      interval = setInterval(() => {
        try {
          if (soundRef.current) {
            // Check Expo Audio SDK 57 properties (currentTime & duration in seconds)
            if (typeof soundRef.current.currentTime === 'number') {
              setCurrentTime(soundRef.current.currentTime);
            }
            if (typeof soundRef.current.duration === 'number' && soundRef.current.duration > 0) {
              setDuration(soundRef.current.duration);
            }
            // Check Expo AV status async fallback
            if (typeof soundRef.current.getStatusAsync === 'function') {
              soundRef.current.getStatusAsync().then((status) => {
                if (status && status.isLoaded) {
                  setCurrentTime(status.positionMillis / 1000);
                  setDuration((status.durationMillis || 0) / 1000);
                  if (status.didJustFinish) setIsPlaying(false);
                }
              }).catch(() => {});
            }
          }
        } catch (e) {}
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Sleep Timer Countdown Loop
  useEffect(() => {
    let timer = null;
    if (isSleepTimerActive && sleepTimerSecondsLeft > 0) {
      timer = setInterval(() => {
        setSleepTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isSleepTimerActive && sleepTimerSecondsLeft === 0) {
      if (soundRef.current) {
        try {
          if (typeof soundRef.current.pause === 'function') soundRef.current.pause();
          else if (typeof soundRef.current.pauseAsync === 'function') soundRef.current.pauseAsync().catch(() => {});
        } catch (e) {}
      }
      setIsPlaying(false);
      setIsSleepTimerActive(false);
      setSleepTimerMinutes(0);
      setTimerToastMsg('تم إيقاف تشغيل القرآن تلقائياً حسب مؤقت النوم المحُدد.');
      setTimeout(() => setTimerToastMsg(''), 8000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSleepTimerActive, sleepTimerSecondsLeft]);

  function startSleepTimer(minutes) {
    const mins = Number(minutes);
    if (!mins || mins <= 0) {
      setIsSleepTimerActive(false);
      setSleepTimerMinutes(0);
      setSleepTimerSecondsLeft(0);
      setShowTimerModal(false);
      setTimerToastMsg('تم إلغاء مؤقت إيقاف القرآن.');
      setTimeout(() => setTimerToastMsg(''), 4000);
    } else {
      setSleepTimerMinutes(mins);
      setSleepTimerSecondsLeft(mins * 60);
      setIsSleepTimerActive(true);
      setShowTimerModal(false);
      setTimerToastMsg(`تم تفعيل مؤقت النوم: سيتم إيقاف تشغيل القرآن بعد ${mins} دقيقة تلقائياً.`);
      setTimeout(() => setTimerToastMsg(''), 6000);
    }
  }

  // Fetch API Data (Reciters, Radios, Surahs)
  useEffect(() => {
    fetch('https://www.mp3quran.net/api/v3/reciters?language=ar')
      .then((res) => res.json())
      .then((data) => {
        const reciters = data.reciters || [];
        setAllSheikhs(reciters);
        if (reciters.length > 0) setSelectedSheikhId(String(reciters[0].id));
      })
      .catch((err) => console.error('Error fetching reciters:', err));

    fetch('https://www.mp3quran.net/api/v3/radios?language=ar')
      .then((res) => res.json())
      .then((data) => {
        const radiosList = data.radios || [];
        setAllRadios([EGYPT_QURAN_RADIO, ...radiosList]);
      })
      .catch((err) => {
        console.error('Error fetching radios:', err);
        setAllRadios([EGYPT_QURAN_RADIO]);
      });

    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        const surahs = data.data || [];
        setAllSurahs(surahs);
        if (surahs.length > 0) setSelectedSurahNum(String(surahs[0].number));
      })
      .catch((err) => console.error('Error fetching surahs:', err));
  }, []);

  // Filters
  const filteredSheikhs = useMemo(() => {
    const search = sheikhSearch.trim().toLowerCase();
    if (!search) return allSheikhs;
    return allSheikhs.filter((s) => (s.name || '').toLowerCase().includes(search));
  }, [allSheikhs, sheikhSearch]);

  const filteredRadios = useMemo(() => {
    const search = radioSearch.trim().toLowerCase();
    if (!search) return allRadios;
    return allRadios.filter((r) => (r.name || '').toLowerCase().includes(search));
  }, [allRadios, radioSearch]);

  const filteredSurahs = useMemo(() => {
    const search = surahSearch.trim().toLowerCase();
    if (!search) return allSurahs;
    return allSurahs.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(search) ||
        String(s.number).includes(search)
    );
  }, [allSurahs, surahSearch]);

  const filteredMushafSurahs = useMemo(() => {
    const search = mushafSearch.trim().toLowerCase();
    if (!search) return allSurahs;
    return allSurahs.filter(
      (s) =>
        (s.name || '').toLowerCase().includes(search) ||
        String(s.number).includes(search)
    );
  }, [allSurahs, mushafSearch]);

  const currentSurah = useMemo(
    () => allSurahs.find((s) => String(s.number) === String(selectedSurahNum)),
    [allSurahs, selectedSurahNum]
  );

  const currentReadSurah = useMemo(
    () => allSurahs.find((s) => String(s.number) === String(selectedReadSurahNum)),
    [allSurahs, selectedReadSurahNum]
  );

  const currentSheikh = useMemo(
    () => allSheikhs.find((s) => String(s.id) === String(selectedSheikhId)),
    [allSheikhs, selectedSheikhId]
  );

  function loadSurahText(num) {
    if (!num) return;
    setLoadingAyahs(true);
    fetch(`https://api.alquran.cloud/v1/surah/${num}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.ayahs && data.data.ayahs.length > 0) {
          setQuranAyahs(data.data.ayahs);
        } else {
          throw new Error('Empty ayahs');
        }
      })
      .catch(() => {
        fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${num}`)
          .then((res) => res.json())
          .then((data) => {
            const verses = (data.verses || []).map((v) => ({
              numberInSurah: parseInt(v.verse_key.split(':')[1], 10),
              text: v.text_uthmani,
            }));
            setQuranAyahs(verses);
          })
          .catch(() => setQuranAyahs([]));
      })
      .finally(() => setLoadingAyahs(false));
  }

  function loadReadSurahText(num) {
    if (!num) return;
    setLoadingReadAyahs(true);
    fetch(`https://api.alquran.cloud/v1/surah/${num}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.ayahs && data.data.ayahs.length > 0) {
          setReadSurahAyahs(data.data.ayahs);
        } else {
          throw new Error('Empty ayahs');
        }
      })
      .catch(() => {
        fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${num}`)
          .then((res) => res.json())
          .then((data) => {
            const verses = (data.verses || []).map((v) => ({
              numberInSurah: parseInt(v.verse_key.split(':')[1], 10),
              text: v.text_uthmani,
            }));
            setReadSurahAyahs(verses);
          })
          .catch(() => setReadSurahAyahs([]));
      })
      .finally(() => setLoadingReadAyahs(false));
  }

  useEffect(() => {
    if (selectedReadSurahNum) {
      loadReadSurahText(selectedReadSurahNum);
    }
  }, [selectedReadSurahNum]);

  useEffect(() => {
    if (selectedSurahNum) {
      loadSurahText(selectedSurahNum);
    }
  }, [selectedSurahNum]);

  // Play Audio Helper function (Supports Expo SDK 57 expo-audio & legacy expo-av)
  async function loadAndPlayAudio(url, title, autoStart = false) {
    try {
      setLoadingAudio(true);
      setCurrentAudioTitle(title);

      if (salawatSoundRef.current) {
        try {
          if (salawatSoundRef.current.pause) salawatSoundRef.current.pause();
          else if (salawatSoundRef.current.pauseAsync) await salawatSoundRef.current.pauseAsync().catch(() => {});
        } catch (e) {}
        setIsSalawatPlaying(false);
      }

      if (soundRef.current) {
        try {
          if (soundRef.current.pause) soundRef.current.pause();
          else if (soundRef.current.unloadAsync) await soundRef.current.unloadAsync().catch(() => {});
        } catch (e) {}
      }

      if (ExpoAudioSDK57 && ExpoAudioSDK57.createAudioPlayer) {
        const player = ExpoAudioSDK57.createAudioPlayer(url);
        try {
          if (player.setVolume) player.setVolume(isMuted ? 0 : volume);
          else player.volume = isMuted ? 0 : volume;
        } catch (e) {}
        try {
          if (player.setPlaybackRate) player.setPlaybackRate(playbackSpeed);
          else if (player.setRate) player.setRate(playbackSpeed);
        } catch (e) {}
        soundRef.current = player;
        if (autoStart && player.play) player.play();
        setIsPlaying(autoStart);
      } else if (Audio && Audio.Sound) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: autoStart, volume: isMuted ? 0 : volume, rate: playbackSpeed },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(autoStart);
      } else {
        setIsPlaying(autoStart);
      }
    } catch (err) {
      console.error('Audio load error:', err);
      setIsPlaying(false);
    } finally {
      setLoadingAudio(false);
    }
  }

  function onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration((status.durationMillis || 0) / 1000);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  }

  // Handle Surah Playback Selection Change
  useEffect(() => {
    if (activeTab !== 'surah' || !selectedSheikhId || !selectedSurahNum) return;

    const sheikh = allSheikhs.find((s) => String(s.id) === String(selectedSheikhId));
    if (!sheikh || !sheikh.moshaf || sheikh.moshaf.length === 0) return;

    const surahNumStr = String(selectedSurahNum);
    const chosenMoshaf =
      sheikh.moshaf.find(
        (m) => m.surah_list && m.surah_list.split(',').includes(surahNumStr)
      ) || sheikh.moshaf[0];

    const server = chosenMoshaf.server;
    const surahPadded = String(selectedSurahNum).padStart(3, '0');
    const audioSrc = `${server}${surahPadded}.mp3`;
    const surahObj = allSurahs.find((s) => String(s.number) === String(selectedSurahNum));
    const rawName = surahObj ? surahObj.name : selectedSurahNum;
    const cleanSurahName = String(rawName).replace(/^(سُورَةُ|سورة)\s*/, '');
    const title = `الشيخ ${sheikh.name} - سورة ${cleanSurahName}`;

    setSelectedRadioUrl('');
    loadSurahText(selectedSurahNum);

    // Update audio track without forcing immediate auto play on app start
    loadAndPlayAudio(audioSrc, title, false);
  }, [selectedSheikhId, selectedSurahNum, allSheikhs, activeTab]);

  // Radio playback trigger
  function playRadioStation(radioObj) {
    if (!radioObj || !radioObj.url) return;
    setActiveTab('radio');
    setSelectedRadioUrl(radioObj.url);
    const title = radioObj.name.includes('إذاعة') ? radioObj.name : `إذاعة القارئ ${radioObj.name}`;
    loadAndPlayAudio(radioObj.url, title, true);
  }

  // Main Play / Pause Toggle
  async function togglePlayPause() {
    if (!soundRef.current) return;
    try {
      if (salawatSoundRef.current) {
        try {
          if (typeof salawatSoundRef.current.pause === 'function') salawatSoundRef.current.pause();
          else if (typeof salawatSoundRef.current.pauseAsync === 'function') await salawatSoundRef.current.pauseAsync().catch(() => {});
        } catch (e) {}
        setIsSalawatPlaying(false);
      }

      if (isPlaying) {
        if (typeof soundRef.current.pause === 'function') soundRef.current.pause();
        else if (typeof soundRef.current.pauseAsync === 'function') await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        if (typeof soundRef.current.play === 'function') soundRef.current.play();
        else if (typeof soundRef.current.playAsync === 'function') await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Skip Seek Time (-10s / +10s)
  async function skipTime(seconds) {
    if (!soundRef.current) return;
    try {
      const newTime = Math.max(0, currentTime + seconds);
      if (typeof soundRef.current.seekTo === 'function') {
        soundRef.current.seekTo(newTime);
        setCurrentTime(newTime);
      } else if (typeof soundRef.current.setPositionAsync === 'function') {
        await soundRef.current.setPositionAsync(newTime * 1000);
        setCurrentTime(newTime);
      } else if ('currentTime' in soundRef.current) {
        soundRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    } catch (e) {}
  }

  // Handle Seek Bar Change
  async function handleSeek(value) {
    setCurrentTime(value);
    if (!soundRef.current) return;
    try {
      if (typeof soundRef.current.seekTo === 'function') {
        soundRef.current.seekTo(value);
      } else if (typeof soundRef.current.setPositionAsync === 'function') {
        await soundRef.current.setPositionAsync(value * 1000);
      } else if ('currentTime' in soundRef.current) {
        soundRef.current.currentTime = value;
      }
    } catch (e) {}
  }

  // Toggle Mute
  async function toggleMute() {
    if (!soundRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    try {
      if (typeof soundRef.current.setVolume === 'function') {
        soundRef.current.setVolume(newMuted ? 0 : volume);
      } else if (typeof soundRef.current.setVolumeAsync === 'function') {
        await soundRef.current.setVolumeAsync(newMuted ? 0 : volume);
      }
    } catch (e) {}
  }

  // Handle Volume Change
  async function handleVolumeChange(val) {
    setVolume(val);
    setIsMuted(val === 0);
    if (!soundRef.current) return;
    try {
      if (typeof soundRef.current.setVolume === 'function') {
        soundRef.current.setVolume(val);
      } else if (typeof soundRef.current.setVolumeAsync === 'function') {
        await soundRef.current.setVolumeAsync(val);
      }
    } catch (e) {}
  }

  // Change Playback Speed
  async function changeSpeed(speed) {
    setPlaybackSpeed(speed);
    setShowSpeedModal(false);
    if (!soundRef.current) return;
    try {
      if (typeof soundRef.current.setPlaybackRate === 'function') {
        soundRef.current.setPlaybackRate(speed);
      } else if (typeof soundRef.current.setRateAsync === 'function') {
        await soundRef.current.setRateAsync(speed, true);
      }
    } catch (e) {}
  }

  // Salawat Audio Toggle
  async function toggleSalawatAudio() {
    try {
      if (isSalawatPlaying && salawatSoundRef.current) {
        try {
          if (typeof salawatSoundRef.current.pause === 'function') {
            salawatSoundRef.current.pause();
          } else if (typeof salawatSoundRef.current.pauseAsync === 'function') {
            await salawatSoundRef.current.pauseAsync();
          }
        } catch (e) {}
        setIsSalawatPlaying(false);
        return;
      }

      if (soundRef.current) {
        try {
          if (typeof soundRef.current.pause === 'function') {
            soundRef.current.pause();
          } else if (typeof soundRef.current.pauseAsync === 'function') {
            await soundRef.current.pauseAsync();
          }
        } catch (e) {}
        setIsPlaying(false);
      }

      const salawatUrl = 'https://everyayah.com/data/Alafasy_128kbps/033056.mp3';

      if (ExpoAudioSDK57 && typeof ExpoAudioSDK57.createAudioPlayer === 'function') {
        if (!salawatSoundRef.current) {
          const player = ExpoAudioSDK57.createAudioPlayer(salawatUrl);
          salawatSoundRef.current = player;
        }
        if (typeof salawatSoundRef.current.seekTo === 'function') {
          salawatSoundRef.current.seekTo(0);
        }
        if (typeof salawatSoundRef.current.play === 'function') {
          salawatSoundRef.current.play();
        }
        setIsSalawatPlaying(true);
      } else if (Audio && Audio.Sound) {
        if (!salawatSoundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            { uri: salawatUrl },
            { shouldPlay: true }
          );
          salawatSoundRef.current = sound;
          sound.setOnPlaybackStatusUpdate((st) => {
            if (st.didJustFinish) setIsSalawatPlaying(false);
          });
        } else {
          if (typeof salawatSoundRef.current.setPositionAsync === 'function') {
            await salawatSoundRef.current.setPositionAsync(0);
          }
          if (typeof salawatSoundRef.current.playAsync === 'function') {
            await salawatSoundRef.current.playAsync();
          }
        }
        setIsSalawatPlaying(true);
      } else {
        console.warn('Native Audio module not loaded');
      }
    } catch (e) {
      console.error('Salawat audio error:', e);
    }
  }

  // Azkar Functions
  function handleZikrClick(item) {
    setAzkarCounts((prev) => {
      const current = prev[item.id] !== undefined ? prev[item.id] : item.count;
      if (current <= 1) {
        return { ...prev, [item.id]: 0 };
      }
      return { ...prev, [item.id]: current - 1 };
    });
  }

  function resetZikrCount(itemId, initialCount) {
    setAzkarCounts((prev) => ({ ...prev, [itemId]: initialCount }));
  }

  const activeAzkarGroup = useMemo(() => {
    return AZKAR_DATA.find((g) => g.category === activeAzkarCategory) || AZKAR_DATA[0];
  }, [activeAzkarCategory]);

  const isLiveStream = duration === Infinity || selectedRadioUrl !== '';

  // Theme Palette mapping
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, themeStyles.bg]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0b111e' : '#faf8f5'} />

      {/* Timer Toast Banner */}
      {timerToastMsg ? (
        <View style={styles.toastBanner}>
          <Text style={styles.toastText}>{timerToastMsg}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerCard, themeStyles.headerCard]}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconContainer}>
              <FontAwesome5 name="quran" size={24} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>نور القرآن الكريم</Text>
              <Text style={styles.headerSubtitle}>تلاوات، مصحف كامل، إذاعات قرآنية مباشرة، وأذكار المسلم</Text>
            </View>
          </View>

          {/* Theme Toggle Buttons */}
          <View style={styles.themeToggleRow}>
            <TouchableOpacity
              style={[styles.themeBtn, !isDark && styles.themeBtnActiveLight]}
              onPress={() => setIsDark(false)}
            >
              <Ionicons name="sunny-outline" size={14} color={!isDark ? '#0f172a' : '#ffffff'} />
              <Text style={[styles.themeBtnText, !isDark && styles.themeBtnTextActiveLight]}>الوضع النهاري</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.themeBtn, isDark && styles.themeBtnActiveDark]}
              onPress={() => setIsDark(true)}
            >
              <Ionicons name="moon-outline" size={14} color="#ffffff" />
              <Text style={styles.themeBtnText}>الوضع الليلي</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Salawat Honor Banner */}
        <View style={[styles.salawatBanner, themeStyles.salawatBanner]}>
          <View style={styles.salawatTextContainer}>
            <View style={styles.salawatTitleRow}>
              <Text style={styles.salawatTag}>الصلاة على النبي ﷺ</Text>
              <Text style={styles.salawatBadge}>آية مباركة</Text>
            </View>
            <Text style={styles.salawatVerse}>
              «إنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا»
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.salawatPlayBtn, isSalawatPlaying && styles.salawatPlayBtnActive]}
            onPress={toggleSalawatAudio}
          >
            <Ionicons name={isSalawatPlaying ? 'pause' : 'play'} size={16} color={isSalawatPlaying ? '#fff' : '#022c22'} />
            <Text style={[styles.salawatPlayBtnText, isSalawatPlaying && { color: '#fff' }]}>
              {isSalawatPlaying ? 'إيقاف' : 'استمع'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Navigation Segment Dock */}
        <View style={[styles.tabDock, themeStyles.tabDock]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'surah' && themeStyles.tabBtnActive]}
            onPress={() => setActiveTab('surah')}
          >
            <Ionicons name="headset-outline" size={16} color={activeTab === 'surah' ? (isDark ? '#0f172a' : '#fff') : (isDark ? '#94a3b8' : '#475569')} />
            <Text style={[styles.tabBtnText, activeTab === 'surah' && themeStyles.tabBtnTextActive]}>السور والتلاوات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'mushaf' && themeStyles.tabBtnActive]}
            onPress={() => setActiveTab('mushaf')}
          >
            <FontAwesome5 name="book-open" size={14} color={activeTab === 'mushaf' ? (isDark ? '#0f172a' : '#fff') : (isDark ? '#94a3b8' : '#475569')} />
            <Text style={[styles.tabBtnText, activeTab === 'mushaf' && themeStyles.tabBtnTextActive]}>المصحف (قراءة)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'radio' && themeStyles.tabBtnActive]}
            onPress={() => setActiveTab('radio')}
          >
            <Ionicons name="radio-outline" size={16} color={activeTab === 'radio' ? (isDark ? '#0f172a' : '#fff') : (isDark ? '#94a3b8' : '#475569')} />
            <Text style={[styles.tabBtnText, activeTab === 'radio' && themeStyles.tabBtnTextActive]}>إذاعات القرآن</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'azkar' && themeStyles.tabBtnActive]}
            onPress={() => setActiveTab('azkar')}
          >
            <Ionicons name="heart-outline" size={16} color={activeTab === 'azkar' ? (isDark ? '#0f172a' : '#fff') : (isDark ? '#94a3b8' : '#475569')} />
            <Text style={[styles.tabBtnText, activeTab === 'azkar' && themeStyles.tabBtnTextActive]}>الأذكار والأدعية</Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: SURAH RECITATIONS (AUDIO) */}
        {activeTab === 'surah' && (
          <View style={styles.tabContent}>
            {/* Pickers */}
            <View style={[styles.card, themeStyles.card]}>
              <Text style={[styles.inputLabel, themeStyles.textBold]}>🎤 اختر القارئ ({filteredSheikhs.length})</Text>
              <TextInput
                style={[styles.textInput, themeStyles.textInput]}
                placeholder="ابحث عن اسم القارئ..."
                placeholderTextColor="#94a3b8"
                value={sheikhSearch}
                onChangeText={setSheikhSearch}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
                  {filteredSheikhs.slice(0, 20).map((sheikh) => {
                    const selected = String(sheikh.id) === String(selectedSheikhId);
                    return (
                      <TouchableOpacity
                        key={sheikh.id}
                        style={[styles.chip, selected && styles.chipActive]}
                        onPress={() => setSelectedSheikhId(String(sheikh.id))}
                      >
                        <Text style={[styles.chipText, selected && styles.chipTextActive]}>{sheikh.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            <View style={[styles.card, themeStyles.card]}>
              <Text style={[styles.inputLabel, themeStyles.textBold]}>📖 اختر السورة المباركة (114 سورة)</Text>
              <TextInput
                style={[styles.textInput, themeStyles.textInput]}
                placeholder="ابحث عن اسم السورة..."
                placeholderTextColor="#94a3b8"
                value={surahSearch}
                onChangeText={setSurahSearch}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
                  {filteredSurahs.slice(0, 30).map((surah) => {
                    const selected = String(surah.number) === String(selectedSurahNum);
                    return (
                      <TouchableOpacity
                        key={surah.number}
                        style={[styles.chip, selected && styles.chipActive]}
                        onPress={() => setSelectedSurahNum(String(surah.number))}
                      >
                        <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                          {surah.number} - {surah.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Ayahs Container */}
            <View style={[styles.card, themeStyles.card]}>
              <View style={styles.surahHeaderRow}>
                {currentSurah && (
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.surahBadgeTitle, themeStyles.primaryColor]}>سورة {currentSurah.name}</Text>
                    <Text style={styles.ayahCountBadge}>{currentSurah.numberOfAyahs} آية</Text>
                  </View>
                )}
                {currentSheikh && (
                  <Text style={[styles.reciterLabel, themeStyles.subText]}>القارئ: {currentSheikh.name}</Text>
                )}
              </View>

              {loadingAyahs ? (
                <ActivityIndicator size="large" color="#059669" style={{ marginVertical: 30 }} />
              ) : (
                <View style={styles.ayahsListContainer}>
                  {quranAyahs.map((ayah) => (
                    <View key={ayah.numberInSurah} style={[styles.ayahItemCard, themeStyles.ayahItemCard]}>
                      <Text style={[styles.ayahText, themeStyles.mainText]}>{ayah.text}</Text>
                      <View style={styles.ayahNumBadge}>
                        <Text style={styles.ayahNumText}>{ayah.numberInSurah}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* TAB 2: MUSHAF READING MODE (Surah Selection List & Edge-to-Edge Image Reader) */}
        {activeTab === 'mushaf' && (
          <View style={styles.tabContent}>
            {!showMushafReader ? (
              /* STEP 1: INITIAL CLEAN SURAH SELECTION VIEW */
              <View style={[styles.card, themeStyles.card]}>
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Text style={[styles.cardTitle, themeStyles.mainText, { textAlign: 'center', fontSize: 18 }]}>
                    📖 المصحف الشريف المصور
                  </Text>
                  <Text style={[styles.subtitleText, themeStyles.subText, { textAlign: 'center', marginTop: 4 }]}>
                    اختر السورة لمطالعة صفحاتها المصورة مباشرة
                  </Text>
                </View>

                <TextInput
                  style={[styles.textInput, themeStyles.textInput, { marginBottom: 14 }]}
                  placeholder="ابحث باسم السورة (البقرة، الكهف، يس، الفاتحة...)..."
                  placeholderTextColor="#94a3b8"
                  value={mushafSearch}
                  onChangeText={setMushafSearch}
                />

                {/* Surahs Grid List */}
                <View style={styles.surahSelectionGrid}>
                  {filteredMushafSurahs.map((surah) => {
                    const range = SURAH_PAGE_RANGES[surah.number] || [1, 1];
                    const pageCount = range[1] - range[0] + 1;
                    return (
                      <TouchableOpacity
                        key={surah.number}
                        style={[styles.surahGridCard, themeStyles.card]}
                        onPress={() => {
                          setSelectedReadSurahNum(String(surah.number));
                          setMushafPageNum(range[0]);
                          setShowMushafReader(true);
                        }}
                      >
                        <View style={styles.surahGridHeaderRow}>
                          <View style={styles.surahNumCircle}>
                            <Text style={styles.surahNumCircleText}>{surah.number}</Text>
                          </View>
                          <Text style={[styles.surahGridName, themeStyles.mainText]}>
                            سورة {surah.name}
                          </Text>
                        </View>
                        <View style={styles.surahGridMetaRow}>
                          <Text style={styles.surahGridBadge}>
                            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                          </Text>
                          <Text style={styles.surahGridBadge}>
                            {surah.numberOfAyahs} آية
                          </Text>
                          <Text style={styles.surahGridBadgeGold}>
                            {pageCount} {pageCount === 1 ? 'صفحة' : 'صفحات'} (صـ {range[0]}-{range[1]})
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : (
              /* STEP 2: FULL SCREEN MUSHAF PAGE READER FOR SELECTED SURAH */
              (() => {
                const surahObj = currentReadSurah || allSurahs[0] || { number: 1, name: 'الفاتحة', revelationType: 'Meccan', numberOfAyahs: 7 };
                const range = SURAH_PAGE_RANGES[surahObj.number] || [1, 1];
                const startP = range[0];
                const endP = range[1];
                const totalPagesInSurah = endP - startP + 1;
                const currentSurahPageIndex = Math.max(0, Math.min(mushafPageNum - startP, totalPagesInSurah - 1));

                const surahPages = [];
                for (let p = startP; p <= endP; p++) {
                  surahPages.push(p);
                }

                const handlePrevPageInSurah = () => {
                  if (mushafPageNum > startP) {
                    setMushafPageNum(mushafPageNum - 1);
                  } else if (surahObj.number > 1) {
                    const prevSurahNum = surahObj.number - 1;
                    setSelectedReadSurahNum(String(prevSurahNum));
                    const prevRange = SURAH_PAGE_RANGES[prevSurahNum] || [1, 1];
                    setMushafPageNum(prevRange[1]);
                  }
                };

                const handleNextPageInSurah = () => {
                  if (mushafPageNum < endP) {
                    setMushafPageNum(mushafPageNum + 1);
                  } else if (surahObj.number < 114) {
                    const nextSurahNum = surahObj.number + 1;
                    setSelectedReadSurahNum(String(nextSurahNum));
                    const nextRange = SURAH_PAGE_RANGES[nextSurahNum] || [1, 1];
                    setMushafPageNum(nextRange[0]);
                  }
                };

                return (
                  <View style={[styles.mushafFullPageCard, { backgroundColor: isDark ? '#0f172a' : '#fff' }]}>
                    {/* Top Bar with Back Button & Surah Title Banner */}
                    <View style={styles.surahPageTopNavRow}>
                      <TouchableOpacity
                        style={styles.backToGridBtn}
                        onPress={() => setShowMushafReader(false)}
                      >
                        <Ionicons name="apps-sharp" size={15} color="#ffffff" />
                        <Text style={styles.backToGridBtnText}>قائمة السور</Text>
                      </TouchableOpacity>

                      <View style={{ alignItems: 'center' }}>
                        <Text style={styles.surahPageBannerTitle}>سُورَةُ {surahObj.name}</Text>
                        <Text style={styles.pageBadgeTextSmall}>
                          صفحة {currentSurahPageIndex + 1} من {totalPagesInSurah} (صـ {mushafPageNum})
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row-reverse', gap: 4 }}>
                        <TouchableOpacity
                          disabled={surahObj.number === 1 && mushafPageNum === 1}
                          style={[styles.pageFlipBtnMini, surahObj.number === 1 && mushafPageNum === 1 && { opacity: 0.3 }]}
                          onPress={handlePrevPageInSurah}
                        >
                          <Ionicons name="arrow-forward" size={13} color="#ffffff" />
                          <Text style={styles.pageFlipBtnTextMini}>السابقة</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          disabled={surahObj.number === 114 && mushafPageNum === 604}
                          style={[styles.pageFlipBtnMini, surahObj.number === 114 && mushafPageNum === 604 && { opacity: 0.3 }]}
                          onPress={handleNextPageInSurah}
                        >
                          <Text style={styles.pageFlipBtnTextMini}>التالية</Text>
                          <Ionicons name="arrow-back" size={13} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Edge-to-Edge Full Screen Image Carousel */}
                    <View style={styles.mushafImageFrameFull}>
                      <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentOffset={{ x: currentSurahPageIndex * width, y: 0 }}
                        onMomentumScrollEnd={(e) => {
                          const pageIdx = Math.round(e.nativeEvent.contentOffset.x / width);
                          if (pageIdx >= 0 && pageIdx < surahPages.length) {
                            setMushafPageNum(surahPages[pageIdx]);
                          }
                        }}
                        style={{ width: width }}
                      >
                        {surahPages.map((pageNo) => (
                          <View key={`surah-page-${pageNo}`} style={{ width: width, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                              source={{ uri: `https://quran.ksu.edu.sa/ayat/safahat1/${pageNo}.png` }}
                              style={{
                                width: width,
                                height: width * 1.54,
                                maxHeight: 670,
                              }}
                              resizeMode="contain"
                            />
                          </View>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Bottom Info Banner */}
                    <View style={styles.mushafFooterBanner}>
                      <Text style={styles.mushafFooterText}>
                        سورة {surahObj.name} - صفحة {currentSurahPageIndex + 1} من {totalPagesInSurah} (الصفحة {mushafPageNum} في المصحف)
                      </Text>
                    </View>
                  </View>
                );
              })()
            )}
          </View>
        )}

        {/* TAB 3: LIVE QURAN RADIOS */}
        {activeTab === 'radio' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, themeStyles.card]}>
              <Text style={[styles.cardTitle, themeStyles.mainText]}>إذاعات القرآن الكريم لجميع القراء</Text>
              <Text style={[styles.subtitleText, themeStyles.subText]}>
                استمع مباشرة للبث المتواصل 24 ساعة من إذاعة القاهرة وكل قراء العالم الإسلامي
              </Text>
              <TextInput
                style={[styles.textInput, themeStyles.textInput, { marginTop: 10 }]}
                placeholder="ابحث عن إذاعة قارئ (نعينع، عبدالباسط، مصر...)..."
                placeholderTextColor="#94a3b8"
                value={radioSearch}
                onChangeText={setRadioSearch}
              />
            </View>

            <View style={styles.radioGrid}>
              {filteredRadios.map((radio) => {
                const isSelected = selectedRadioUrl === radio.url;
                return (
                  <TouchableOpacity
                    key={radio.id}
                    style={[styles.radioCard, themeStyles.radioCard, isSelected && styles.radioCardSelected]}
                    onPress={() => playRadioStation(radio)}
                  >
                    <View style={styles.radioCardRow}>
                      <View style={[styles.radioIconBox, radio.isEgypt && { backgroundColor: '#d97706' }]}>
                        <Ionicons name="radio" size={18} color="#fff" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.radioName, themeStyles.mainText]}>{radio.name}</Text>
                        {radio.isEgypt && <Text style={styles.officialBadge}>البث الرسمي المصرية</Text>}
                      </View>
                      {isSelected && (
                        <View style={styles.liveGreenDot} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 4: AZKAR & SUPPLICATIONS */}
        {activeTab === 'azkar' && (
          <View style={styles.tabContent}>
            <View style={[styles.card, themeStyles.card]}>
              <Text style={[styles.cardTitle, themeStyles.mainText]}>أذكار المسلم اليومية وأدعيته</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
                  {AZKAR_DATA.map((group) => {
                    const selected = activeAzkarCategory === group.category;
                    return (
                      <TouchableOpacity
                        key={group.category}
                        style={[styles.chip, selected && styles.chipActive]}
                        onPress={() => setActiveAzkarCategory(group.category)}
                      >
                        <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                          {group.category} ({group.items.length})
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Azkar List */}
            <View style={styles.azkarListContainer}>
              {activeAzkarGroup.items.map((item) => {
                const countLeft = azkarCounts[item.id] !== undefined ? azkarCounts[item.id] : item.count;
                const isDone = countLeft === 0;

                return (
                  <View key={item.id} style={[styles.card, themeStyles.card, isDone && { opacity: 0.6 }]}>
                    <Text style={[styles.azkarText, themeStyles.mainText]}>{item.text}</Text>
                    {item.reward && (
                      <Text style={styles.azkarRewardText}>فضل الذكر: {item.reward}</Text>
                    )}

                    <View style={styles.azkarActionsRow}>
                      <TouchableOpacity
                        style={[styles.countBtn, isDone && styles.countBtnDone]}
                        onPress={() => handleZikrClick(item)}
                      >
                        <Text style={styles.countBtnText}>
                          {isDone ? 'تم الذكر' : `المتبقي: ${countLeft}`}
                        </Text>
                      </TouchableOpacity>

                      {azkarCounts[item.id] !== undefined && (
                        <TouchableOpacity
                          style={styles.resetCountBtn}
                          onPress={() => resetZikrCount(item.id, item.count)}
                        >
                          <Ionicons name="refresh" size={16} color="#64748b" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ULTRA-PRO FLOATING BOTTOM AUDIO PLAYER */}
      <View style={[styles.floatingPlayer, themeStyles.floatingPlayer]}>
        {/* Track Title Info */}
        <View style={styles.playerTrackInfoRow}>
          <View style={styles.playerIconCircle}>
            <Ionicons name="musical-notes" size={20} color="#ffffff" />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
              <View style={[styles.liveDot, isPlaying && styles.liveDotActive]} />
              <Text style={styles.playerStatusTag}>
                {isLiveStream ? 'بث مباشر الآن' : isPlaying ? 'جاري التشغيل' : 'متوقف مؤقتاً'}
              </Text>
            </View>
            <Text style={[styles.playerTrackTitle, themeStyles.mainText]} numberOfLines={1}>
              {currentAudioTitle || 'اختر تلاوة أو إذاعة للبدء'}
            </Text>
          </View>
        </View>

        {/* Progress Bar & Time */}
        {!isLiveStream && (
          <View style={styles.playerProgressRow}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Slider
              style={styles.sliderStyle}
              minimumValue={0}
              maximumValue={duration || 100}
              value={currentTime}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#059669"
              maximumTrackTintColor="#cbd5e1"
              thumbTintColor="#059669"
            />
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        )}

        {/* Controls Row */}
        <View style={styles.playerControlsRow}>
          {/* Sleep Timer button */}
          <TouchableOpacity
            style={[styles.playerOptionBtn, isSleepTimerActive && styles.playerOptionBtnActive]}
            onPress={() => setShowTimerModal(true)}
          >
            <Ionicons name="timer-outline" size={16} color={isSleepTimerActive ? '#fff' : '#059669'} />
            <Text style={[styles.playerOptionText, isSleepTimerActive && { color: '#fff' }]}>
              {isSleepTimerActive ? `${formatTime(sleepTimerSecondsLeft)}` : 'المؤقت'}
            </Text>
          </TouchableOpacity>

          {/* Speed Selector */}
          {!isLiveStream && (
            <TouchableOpacity
              style={styles.playerOptionBtn}
              onPress={() => setShowSpeedModal(true)}
            >
              <Text style={styles.speedBtnText}>{playbackSpeed}x</Text>
            </TouchableOpacity>
          )}

          {/* Skip -10s */}
          {!isLiveStream && (
            <TouchableOpacity style={styles.skipBtn} onPress={() => skipTime(-10)} activeOpacity={0.7}>
              <MaterialIcons name="replay-10" size={26} color="#059669" />
            </TouchableOpacity>
          )}

          {/* MAIN PLAY/PAUSE */}
          <TouchableOpacity style={styles.mainPlayBtn} onPress={togglePlayPause} activeOpacity={0.8}>
            {loadingAudio ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#ffffff" style={{ marginLeft: isPlaying ? 0 : 2 }} />
            )}
          </TouchableOpacity>

          {/* Skip +10s */}
          {!isLiveStream && (
            <TouchableOpacity style={styles.skipBtn} onPress={() => skipTime(10)} activeOpacity={0.7}>
              <MaterialIcons name="forward-10" size={26} color="#059669" />
            </TouchableOpacity>
          )}

          {/* Mute Toggle */}
          <TouchableOpacity style={styles.skipBtn} onPress={toggleMute} activeOpacity={0.7}>
            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={22} color="#059669" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SLEEP TIMER MODAL */}
      <SleepTimerModal
        visible={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        isTimerActive={isSleepTimerActive}
        secondsLeft={sleepTimerSecondsLeft}
        selectedMins={sleepTimerMinutes}
        onStartTimer={startSleepTimer}
      />

      {/* SPEED SELECTION MODAL */}
      <Modal visible={showSpeedModal} transparent animationType="fade">
        <View style={styles.speedModalOverlay}>
          <View style={styles.speedModalCard}>
            <Text style={styles.speedModalTitle}>اختر سرعة التشغيل</Text>
            {[0.75, 1.0, 1.25, 1.5].map((spd) => (
              <TouchableOpacity
                key={spd}
                style={[styles.speedItem, playbackSpeed === spd && styles.speedItemActive]}
                onPress={() => changeSpeed(spd)}
              >
                <Text style={[styles.speedItemText, playbackSpeed === spd && { color: '#fff' }]}>
                  {spd === 1.0 ? '1.0x (عادي)' : `${spd}x`}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.closeSpeedBtn} onPress={() => setShowSpeedModal(false)}>
              <Text style={styles.closeSpeedText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const lightTheme = StyleSheet.create({
  bg: { backgroundColor: '#faf8f5' },
  headerCard: { backgroundColor: '#064e3b' },
  salawatBanner: { backgroundColor: '#022c22' },
  tabDock: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  tabBtnActive: { backgroundColor: '#065f46' },
  tabBtnTextActive: { color: '#ffffff' },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  mainText: { color: '#0f172a' },
  subText: { color: '#64748b' },
  textBold: { color: '#065f46' },
  primaryColor: { color: '#065f46' },
  textInput: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a' },
  ayahItemCard: { backgroundColor: '#fffbeb', borderColor: '#fef3c7' },
  radioCard: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  floatingPlayer: { backgroundColor: '#ffffff', borderTopColor: '#e2e8f0' },
});

const darkTheme = StyleSheet.create({
  bg: { backgroundColor: '#0b111e' },
  headerCard: { backgroundColor: '#0f172a' },
  salawatBanner: { backgroundColor: '#022c22' },
  tabDock: { backgroundColor: '#0f172a', borderColor: '#1e293b' },
  tabBtnActive: { backgroundColor: '#10b981' },
  tabBtnTextActive: { color: '#0f172a' },
  card: { backgroundColor: '#0f172a', borderColor: '#1e293b' },
  mainText: { color: '#f8fafc' },
  subText: { color: '#94a3b8' },
  textBold: { color: '#10b981' },
  primaryColor: { color: '#10b981' },
  textInput: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' },
  ayahItemCard: { backgroundColor: '#1e293b', borderColor: '#334155' },
  radioCard: { backgroundColor: '#0f172a', borderColor: '#1e293b' },
  floatingPlayer: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 170,
  },
  toastBanner: {
    backgroundColor: '#d97706',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    elevation: 4,
  },
  headerTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#a7f3d0',
    textAlign: 'right',
  },
  themeToggleRow: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 3,
    alignSelf: 'flex-start',
  },
  themeBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  themeBtnActiveLight: {
    backgroundColor: '#ffffff',
  },
  themeBtnActiveDark: {
    backgroundColor: '#0f172a',
  },
  themeBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  themeBtnTextActiveLight: {
    color: '#0f172a',
  },
  salawatBanner: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.4)',
  },
  salawatTextContainer: {
    flex: 1,
  },
  salawatTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  salawatTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  salawatBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    color: '#fef08a',
    fontSize: 9,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  salawatVerse: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f0fdf4',
    textAlign: 'right',
    lineHeight: 20,
  },
  salawatPlayBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fbbf24',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  salawatPlayBtnActive: {
    backgroundColor: '#e11d48',
  },
  salawatPlayBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#022c22',
  },
  tabDock: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 22,
    padding: 6,
    borderWidth: 1,
    marginBottom: 16,
    gap: 6,
  },
  tabBtn: {
    width: '48%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 16,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContent: {
    gap: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  subtitleText: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 6,
  },
  textInput: {
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 12,
    textAlign: 'right',
  },
  chip: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chipActive: {
    backgroundColor: '#059669',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  surahHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  surahBadgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ayahCountBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  reciterLabel: {
    fontSize: 11,
  },
  ayahsListContainer: {
    gap: 8,
  },
  ayahItemCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ayahText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
  },
  ayahNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ayahNumText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Mushaf Mode & Page Reader Styles
  mushafModeToggleRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 8,
  },
  mushafModeBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: 'transparent',
  },
  mushafModeBtnActive: {
    backgroundColor: '#059669',
  },
  mushafModeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  mushafModeTextActive: {
    color: '#ffffff',
  },
  pageNavControlsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
    gap: 6,
  },
  pageFlipBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pageFlipBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  pageBadgeBox: {
    backgroundColor: '#fef3c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  pageBadgeText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pageJumpRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  pageJumpLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pageJumpInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
  },
  mushafPageCard: {
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  mushafFullPageCard: {
    width: '100%',
    marginHorizontal: 0,
    paddingVertical: 4,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0,
  },
  mushafImageFrameFull: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffdf7',
    overflow: 'hidden',
    marginVertical: 4,
  },
  // Surah Selection Grid & Reader Styles
  surahSelectionGrid: {
    gap: 8,
  },
  surahGridCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  surahGridHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  surahNumCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumCircleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  surahGridName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahGridMetaRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    alignItems: 'center',
  },
  surahGridBadge: {
    fontSize: 10,
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: 'bold',
  },
  surahGridBadgeGold: {
    fontSize: 10,
    color: '#92400e',
    backgroundColor: '#fef3c7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: 'bold',
  },
  surahPageTopNavRow: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  backToGridBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  backToGridBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  pageFlipBtnMini: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  pageFlipBtnTextMini: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pageBadgeTextSmall: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
    marginTop: 2,
  },
  surahPageBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  surahPageMetaRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    alignItems: 'center',
  },
  surahMetaChip: {
    backgroundColor: '#059669',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  mushafImageFrame: {
    width: '100%',
    backgroundColor: '#fffef5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d97706',
    overflow: 'hidden',
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 6,
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mushafImageWrapper: {
    width: '100%',
    height: 520,
    backgroundColor: '#fffdf7',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  mushafPageImg: {
    width: '100%',
    height: '100%',
  },
  imageLoaderOverlay: {
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  mushafFooterBanner: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
  },
  mushafFooterText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mushafHeaderControls: {
    gap: 10,
  },
  fontSizeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  fontSizeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  fontBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fontSizeVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  surahNavBtnsRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginTop: 4,
  },
  surahNavBtn: {
    backgroundColor: '#059669',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  surahNavBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  uthmaniHeaderBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  uthmaniFrameBorder: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d97706',
    backgroundColor: 'rgba(217, 119, 6, 0.06)',
  },
  uthmaniFrameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
  },
  metaBadgeChip: {
    backgroundColor: '#059669',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  bismillahDecoratedFrame: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.25)',
  },
  bismillahUthmaniText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
  },
  readSurahTitleBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  readSurahTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
  },
  readSurahMetaRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginTop: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: '#64748b',
  },
  bismillahText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 10,
  },
  mushafParagraphContainer: {
    paddingHorizontal: 6,
  },
  mushafFullText: {
    textAlign: 'justify',
  },
  mushafAyahBadge: {
    color: '#059669',
    fontWeight: 'bold',
  },
  radioGrid: {
    gap: 8,
  },
  radioCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  radioCardSelected: {
    borderColor: '#059669',
    borderWidth: 2,
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
  },
  radioCardRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  radioIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioName: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  officialBadge: {
    fontSize: 9,
    color: '#d97706',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  liveGreenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
  },
  azkarListContainer: {
    gap: 10,
  },
  azkarText: {
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  azkarRewardText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 6,
  },
  azkarActionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  countBtn: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  countBtnDone: {
    backgroundColor: '#94a3b8',
  },
  countBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetCountBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Player
  floatingPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  playerTrackInfoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  playerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94a3b8',
  },
  liveDotActive: {
    backgroundColor: '#10b981',
  },
  playerStatusTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'right',
  },
  playerTrackTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 2,
  },
  playerProgressRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 'bold',
    minWidth: 38,
    textAlign: 'center',
  },
  sliderStyle: {
    flex: 1,
    height: 24,
  },
  playerControlsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  playerOptionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
  },
  playerOptionBtnActive: {
    backgroundColor: '#d97706',
    borderColor: '#b45309',
  },
  playerOptionText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  speedBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  skipBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPlayBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  // Speed modal
  speedModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  speedModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  speedModalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 14,
  },
  speedItem: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    marginBottom: 6,
  },
  speedItemActive: {
    backgroundColor: '#059669',
  },
  speedItemText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
  },
  closeSpeedBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  closeSpeedText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 'bold',
  },
});
