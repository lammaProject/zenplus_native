const React = require('react');
const { View } = require('react-native');
const SafeAreaView = (props) => React.createElement(View, props);
const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
module.exports = { SafeAreaView, useSafeAreaInsets };
