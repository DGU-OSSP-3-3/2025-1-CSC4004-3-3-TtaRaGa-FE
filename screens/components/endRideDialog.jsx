import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EndRideDialog = ({ visible, onConfirm, onCancel }) => (
  <Modal isVisible={visible}>
    <View style={styles.modal}>
      <Text style={styles.title}>라이딩 종료</Text>
      <Text style={styles.message}>라이딩을 종료하시겠습니까?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
          <Text>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
          <Text style={{ color: 'white' }}>종료</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
    modal: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 16,
      alignItems: 'center',
      width: '90%',
      height: 'auto',
      alignSelf: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 16,
      color: '#222',
    },
    message: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginBottom: 24,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 12,
      marginRight: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      alignItems: 'center',
    },
    confirmBtn: {
      flex: 1,
      paddingVertical: 12,
      marginLeft: 8,
      borderRadius: 8,
      backgroundColor: '#4CAF50',
      alignItems: 'center',
    },
  });
export default EndRideDialog;  