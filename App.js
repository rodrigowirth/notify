import React, { Component } from 'react';
import {
  Alert, AppRegistry, AsyncStorage, Platform, StyleSheet, Text,
  TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,
  FlatList, View, ListItem } from 'react-native';
import OneSignal from 'react-native-onesignal';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 100,
    storageBackend: AsyncStorage,
    defaultExpires: 7000 * 3600 * 24,
    enableCache: true,
    sync : {
        // we'll talk about the details later.
    }
})

export default class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    this.loadNotifications();
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
  }

  componentDidMount() {
    OneSignal.configure({});
  }

  render() {
    if (!this.state) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={this.state.notifications}
        renderItem={({item}) => <Text>{item.body}</Text>}
      />
    );
  }

  loadNotifications() {
    storage.getAllDataForKey('notification').then(notifications => {
      this.setState({
        notifications: notifications.reverse().map((notification) => {
          return {
            key: notification.notificationId,
            body: notification.body,
          };
        })
      });
    });
  }

  onReceived(notification) {
    storage.save({
      key: 'notification',
      id: notification.payload.notificationID.replace('-',''),
      data: {
        notificationId: notification.payload.notificationID,
        body: notification.payload.body,
      },
    });
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center'
  },
  button: {
    marginBottom: 30,
    width: 260,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 0,
    color: 'white'
  }
})
