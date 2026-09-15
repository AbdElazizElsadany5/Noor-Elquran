import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '../constants/data';

export default function SleepTimerModal({
  visible,
  onClose,
  isTimerActive,
  secondsLeft,
  selectedMins,
  onStartTimer,
}) {
  const [customInput, setCustomInput] = useState('');

  const PRESETS = [5, 10, 15, 30, 45, 60, 90, 120];

  const handleCustomSubmit = () => {
    const mins = parseInt(customInput, 10);
    if (mins && mins > 0) {
      onStartTimer(mins);
      setCustomInput('');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={22} color="#d97706" />
              </View>
              <View>
                <Text style={styles.titleText}>مؤقت إيقاف القرآن (Sleep Timer)</Text>
                <Text style={styles.subtitleText}>إيقاف التلاوة تلقائياً بعد مدة محُددة</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {/* Active Timer Banner */}
            {isTimerActive && (
              <View style={styles.activeBanner}>
                <View>
                  <Text style={styles.activeLabel}>المؤقت شغال الآن:</Text>
                  <Text style={styles.activeTime}>{formatTime(secondsLeft)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.cancelTimerBtn}
                  onPress={() => onStartTimer(0)}
                >
                  <Text style={styles.cancelTimerText}>إلغاء المؤقت</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Presets Grid */}
            <Text style={styles.sectionLabel}>اختر مدة جاهزة:</Text>
            <View style={styles.presetGrid}>
              {PRESETS.map((mins) => {
                const isActive = selectedMins === mins && isTimerActive;
                return (
                  <TouchableOpacity
                    key={mins}
                    style={[styles.presetItem, isActive && styles.presetItemActive]}
                    onPress={() => onStartTimer(mins)}
                  >
                    <Text style={[styles.presetText, isActive && styles.presetTextActive]}>
                      {mins >= 60 ? `${mins / 60} ساعة` : `${mins} د`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Input */}
            <Text style={styles.sectionLabel}>أو أدخل عدد دقائق مخصص:</Text>
            <View style={styles.customRow}>
              <TextInput
                style={styles.customInput}
                keyboardType="numeric"
                placeholder="أدخل عدد الدقائق (مثال: 25)..."
                placeholderTextColor="#94a3b8"
                value={customInput}
                onChangeText={setCustomInput}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleCustomSubmit}>
                <Text style={styles.submitBtnText}>تفعيل</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeFooterBtn} onPress={onClose}>
              <Text style={styles.closeFooterBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  subtitleText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'right',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
  },
  activeBanner: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'right',
  },
  activeTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78350f',
    textAlign: 'right',
  },
  cancelTimerBtn: {
    backgroundColor: '#e11d48',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  cancelTimerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'right',
    marginBottom: 8,
    marginTop: 6,
  },
  presetGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetItem: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  presetItemActive: {
    backgroundColor: '#d97706',
    borderColor: '#b45309',
  },
  presetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  presetTextActive: {
    color: '#ffffff',
  },
  customRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  customInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    textAlign: 'right',
  },
  submitBtn: {
    backgroundColor: '#d97706',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    marginTop: 8,
  },
  closeFooterBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeFooterBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
});
